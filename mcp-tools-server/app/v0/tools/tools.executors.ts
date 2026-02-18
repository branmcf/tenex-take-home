import { MCPToolExecutionFailed } from './tools.errors';

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_MAX_CHARS = 8000;
const DEFAULT_MAX_RESULTS = 5;
const DEFAULT_MAX_RESPONSE_BYTES = 20000;
const DEFAULT_SUMMARY_MAX_WORDS = 120;

const getAllowlist = () => {
    const raw = process.env.MCP_HTTP_REQUEST_ALLOWLIST ?? '';
    return raw
        .split( ',' )
        .map( entry => entry.trim().toLowerCase() )
        .filter( entry => entry.length > 0 );
};

const isIpAddress = ( hostname: string ) => {
    return /^[0-9.]+$/.test( hostname );
};

const isPrivateIp = ( hostname: string ) => {
    if ( !isIpAddress( hostname ) ) {
        return false;
    }

    if ( hostname.startsWith( '10.' ) ) {
        return true;
    }
    if ( hostname.startsWith( '127.' ) ) {
        return true;
    }
    if ( hostname.startsWith( '192.168.' ) ) {
        return true;
    }

    const parts = hostname.split( '.' ).map( part => Number( part ) );
    if ( parts.length === 4 && parts[0] === 172 ) {
        return parts[1] >= 16 && parts[1] <= 31;
    }

    return false;
};

const isHostAllowed = ( hostname: string ) => {
    const allowlist = getAllowlist();
    const normalized = hostname.toLowerCase();

    if ( allowlist.length > 0 ) {
        return allowlist.some( allowed => {
            if ( allowed.startsWith( '*.' ) ) {
                return normalized.endsWith( allowed.slice( 1 ) );
            }

            return normalized === allowed;
        } );
    }

    if ( normalized === 'localhost' || normalized.endsWith( '.local' ) ) {
        return false;
    }

    return !isPrivateIp( normalized );
};

const assertUrlAllowed = ( url: string ) => {
    const parsed = new URL( url );

    if ( parsed.protocol !== 'http:' && parsed.protocol !== 'https:' ) {
        throw new MCPToolExecutionFailed();
    }

    if ( !isHostAllowed( parsed.hostname ) ) {
        throw new MCPToolExecutionFailed();
    }

    return parsed;
};

const fetchWithTimeout = async ( url: string, options: RequestInit, timeoutMs: number ) => {
    const controller = new AbortController();
    const timeout = setTimeout( () => controller.abort(), timeoutMs );

    try {
        const response = await fetch( url, { ...options, signal: controller.signal } );
        return response;
    } finally {
        clearTimeout( timeout );
    }
};

const decodeHtmlEntities = ( text: string ) => {
    return text
        .replace( /&amp;/g, '&' )
        .replace( /&quot;/g, '"' )
        .replace( /&#39;/g, '\'' )
        .replace( /&lt;/g, '<' )
        .replace( /&gt;/g, '>' );
};

const stripHtml = ( html: string ) => {
    return html
        .replace( /<script[\s\S]*?<\/script>/gi, ' ' )
        .replace( /<style[\s\S]*?<\/style>/gi, ' ' )
        .replace( /<[^>]+>/g, ' ' )
        .replace( /\s+/g, ' ' )
        .trim();
};

const truncateText = ( text: string, maxChars: number ) => {
    if ( text.length <= maxChars ) {
        return text;
    }

    return text.slice( 0, maxChars );
};

const safeJsonParse = ( text: string ) => {
    try {
        return JSON.parse( text );
    } catch {
        return null;
    }
};

const extractJsonFromText = ( text: string ) => {
    const startIndex = Math.min(
        ...[ text.indexOf( '{' ), text.indexOf( '[' ) ].filter( idx => idx >= 0 )
    );

    if ( startIndex === Infinity ) {
        return null;
    }

    let depth = 0;
    let inString = false;
    let escape = false;

    for ( let i = startIndex; i < text.length; i += 1 ) {
        const char = text[ i ];

        if ( inString ) {
            if ( escape ) {
                escape = false;
            } else if ( char === '\\' ) {
                escape = true;
            } else if ( char === '"' ) {
                inString = false;
            }
            continue;
        }

        if ( char === '"' ) {
            inString = true;
            continue;
        }

        if ( char === '{' || char === '[' ) {
            depth += 1;
        } else if ( char === '}' || char === ']' ) {
            depth -= 1;
            if ( depth === 0 ) {
                const candidate = text.slice( startIndex, i + 1 );
                return safeJsonParse( candidate );
            }
        }
    }

    return null;
};

const pickFields = ( data: unknown, fields: string[] ) => {
    if ( !data || typeof data !== 'object' || Array.isArray( data ) ) {
        return data;
    }

    const output: Record<string, unknown> = {};
    fields.forEach( field => {
        if ( field in ( data as Record<string, unknown> ) ) {
            output[ field ] = ( data as Record<string, unknown> )[ field ];
        }
    } );

    return output;
};

const summarizeText = ( text: string, maxWords: number ) => {
    const cleaned = text.replace( /\s+/g, ' ' ).trim();
    if ( cleaned.length === 0 ) {
        return '';
    }

    const sentences = cleaned.split( /(?<=[.!?])\s+/ );
    let summary = sentences.slice( 0, 3 ).join( ' ' ).trim();

    if ( summary.length === 0 ) {
        summary = cleaned;
    }

    const words = summary.split( ' ' );
    if ( words.length <= maxWords ) {
        return summary;
    }

    return words.slice( 0, maxWords ).join( ' ' );
};

export const executeWebSearch = async ( input: { query: string; limit?: number } ) => {
    const query = input.query?.trim();
    if ( !query ) {
        throw new MCPToolExecutionFailed();
    }

    const limit = Math.max( 1, Math.min( input.limit ?? DEFAULT_MAX_RESULTS, 10 ) );
    const url = `https://duckduckgo.com/html/?q=${ encodeURIComponent( query ) }`;

    const response = await fetchWithTimeout( url, { method: 'GET' }, DEFAULT_TIMEOUT_MS );
    const html = await response.text();

    const results: Array<{ title: string; url: string; snippet: string }> = [];

    const linkRegex = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
    const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/gi;

    const snippets: string[] = [];
    let snippetMatch;
    while ( ( snippetMatch = snippetRegex.exec( html ) ) !== null ) {
        snippets.push( decodeHtmlEntities( stripHtml( snippetMatch[ 1 ] ) ) );
    }

    let match;
    let index = 0;
    while ( ( match = linkRegex.exec( html ) ) !== null && results.length < limit ) {
        const resultUrl = decodeHtmlEntities( match[ 1 ] );
        const title = decodeHtmlEntities( stripHtml( match[ 2 ] ) );
        const snippet = snippets[ index ] ?? '';
        index += 1;

        if ( title && resultUrl ) {
            results.push( { title, url: resultUrl, snippet } );
        }
    }

    return { results };
};

export const executeReadUrl = async ( input: { url: string; maxChars?: number } ) => {
    const parsed = assertUrlAllowed( input.url );
    const maxChars = Math.max( 500, Math.min( input.maxChars ?? DEFAULT_MAX_CHARS, 20000 ) );

    const response = await fetchWithTimeout( parsed.toString(), { method: 'GET' }, DEFAULT_TIMEOUT_MS );
    const contentType = response.headers.get( 'content-type' ) ?? '';
    const bodyText = await response.text();

    let text = bodyText;
    let title = '';

    if ( contentType.includes( 'text/html' ) ) {
        const titleMatch = bodyText.match( /<title[^>]*>(.*?)<\/title>/i );
        title = titleMatch ? decodeHtmlEntities( stripHtml( titleMatch[ 1 ] ) ) : '';
        text = decodeHtmlEntities( stripHtml( bodyText ) );
    }

    return {
        title
        , text: truncateText( text, maxChars )
    };
};

export const executeHttpRequest = async (
    input: {
        url: string;
        method: string;
        headers?: Record<string, string>;
        body?: unknown;
        timeoutMs?: number;
    }
) => {
    const parsed = assertUrlAllowed( input.url );
    const method = ( input.method || 'GET' ).toUpperCase();
    const timeoutMs = Math.max( 1000, Math.min( input.timeoutMs ?? DEFAULT_TIMEOUT_MS, 20000 ) );

    const headers: Record<string, string> = {};
    if ( input.headers ) {
        Object.entries( input.headers ).forEach( ( [ key, value ] ) => {
            headers[ key ] = String( value );
        } );
    }

    let body: string | undefined;
    if ( input.body !== undefined && input.body !== null && method !== 'GET' && method !== 'HEAD' ) {
        if ( typeof input.body === 'string' ) {
            body = input.body;
        } else {
            body = JSON.stringify( input.body );
            if ( !headers[ 'Content-Type' ] ) {
                headers[ 'Content-Type' ] = 'application/json';
            }
        }
    }

    const response = await fetchWithTimeout(
        parsed.toString()
        , {
            method
            , headers
            , body
        }
        , timeoutMs
    );

    const arrayBuffer = await response.arrayBuffer();
    const bytes = Buffer.from( arrayBuffer );
    const limited = bytes.slice( 0, DEFAULT_MAX_RESPONSE_BYTES );
    const responseBody = limited.toString( 'utf-8' );

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach( ( value, key ) => {
        responseHeaders[ key ] = value;
    } );

    return {
        status: response.status
        , headers: responseHeaders
        , body: responseBody
    };
};

export const executeSummarize = async ( input: { text: string; maxWords?: number } ) => {
    const maxWords = Math.max( 30, Math.min( input.maxWords ?? DEFAULT_SUMMARY_MAX_WORDS, 300 ) );
    return {
        summary: summarizeText( input.text ?? '', maxWords )
    };
};

export const executeExtractJson = async ( input: { text: string; fields?: string[] } ) => {
    const extracted = extractJsonFromText( input.text ?? '' );
    const fields = Array.isArray( input.fields ) ? input.fields : [];
    const data = fields.length > 0 ? pickFields( extracted, fields ) : extracted;

    return {
        data: data ?? null
    };
};
