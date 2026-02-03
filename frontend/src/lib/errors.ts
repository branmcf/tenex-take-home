import { toast } from "sonner";

/**
 * Error categories for classification
 */
export type ErrorCategory =
    | "network"      // Network connectivity issues, CORS, timeouts
    | "auth"         // Authentication/authorization errors from backend
    | "validation"   // Input validation errors
    | "server"       // Server-side errors (5xx)
    | "client"       // Client-side errors (4xx)
    | "unknown";     // Unclassified errors

/**
 * Structured error with metadata for logging and display
 */
export interface AppError {
    category: ErrorCategory;
    code: string;
    message: string;           // User-friendly message
    technicalDetails: string;  // Technical details for logging
    originalError?: unknown;   // Original error for debugging
    timestamp: string;
    context?: Record<string, unknown>;
}

/**
 * Known error codes from Better Auth
 */
const AUTH_ERROR_CODES: Record<string, string> = {
    EMAIL_NOT_VERIFIED: "Please verify your email address before signing in.",
    INVALID_EMAIL_OR_PASSWORD: "The email or password you entered is incorrect.",
    USER_ALREADY_EXISTS: "An account with this email already exists.",
    INVALID_PASSWORD: "Password does not meet requirements.",
    USER_NOT_FOUND: "No account found with this email.",
    SESSION_EXPIRED: "Your session has expired. Please sign in again.",
    INVALID_TOKEN: "Invalid or expired token.",
    TOO_MANY_REQUESTS: "Too many attempts. Please try again later.",
};

/**
 * Detect if an error is a network/CORS error
 */
function isNetworkError( error: unknown ): boolean {
    if ( error instanceof TypeError ) {
        const message = error.message.toLowerCase();
        return (
            message.includes( "failed to fetch" ) ||
            message.includes( "network" ) ||
            message.includes( "cors" ) ||
            message.includes( "load failed" )
        );
    }
    return false;
}

/**
 * Detect if error is a CORS-specific error
 */
function isCorsError( error: unknown ): boolean {
    if ( error instanceof TypeError ) {
        const message = error.message.toLowerCase();

        // "Failed to fetch" with no response usually indicates CORS
        return message.includes( "failed to fetch" );
    }
    return false;
}

/**
 * Extract error details from Better Auth response
 */
function extractBetterAuthError(
    result: { error?: { code?: string; message?: string; status?: number } }
): { code: string; message: string; status?: number } | null {
    if ( !result.error ) return null;

    return {
        code: result.error.code ?? "UNKNOWN_ERROR",
        message: result.error.message ?? "An error occurred",
        status: result.error.status,
    };
}

/**
 * Classify an error into a category
 */
function classifyError( error: unknown, context?: { status?: number } ): ErrorCategory {
    if ( isNetworkError( error ) ) {
        return "network";
    }

    if ( context?.status ) {
        if ( context.status === 401 || context.status === 403 ) {
            return "auth";
        }
        if ( context.status >= 400 && context.status < 500 ) {
            return "client";
        }
        if ( context.status >= 500 ) {
            return "server";
        }
    }

    return "unknown";
}

/**
 * Get user-friendly message based on error category and details
 */
function getUserMessage( category: ErrorCategory, code?: string ): string {
    // Check for known auth error codes first
    if ( code && AUTH_ERROR_CODES[ code ] ) {
        return AUTH_ERROR_CODES[ code ];
    }

    // Fallback messages by category
    switch ( category ) {
        case "network":
            return "Unable to connect to the server. Please check your internet connection and try again.";
        case "auth":
            return "Authentication failed. Please check your credentials and try again.";
        case "validation":
            return "Please check your input and try again.";
        case "server":
            return "Something went wrong on our end. Please try again later.";
        case "client":
            return "There was a problem with your request. Please try again.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}

/**
 * Create a structured AppError from various error types
 */
export function createAppError(
    error: unknown,
    context?: Record<string, unknown>
): AppError {
    const timestamp = new Date().toISOString();

    // Handle Better Auth result errors
    if (
        error &&
        typeof error === "object" &&
        "error" in error
    ) {
        const authError = extractBetterAuthError(
            error as { error?: { code?: string; message?: string; status?: number } }
        );

        if ( authError ) {
            const category = classifyError( error, { status: authError.status } );
            return {
                category,
                code: authError.code,
                message: getUserMessage( category, authError.code ),
                technicalDetails: `[${authError.code}] ${authError.message}`,
                originalError: error,
                timestamp,
                context,
            };
        }
    }

    // Handle TypeError (usually network/CORS)
    if ( error instanceof TypeError ) {
        const isCors = isCorsError( error );
        return {
            category: "network",
            code: isCors ? "CORS_ERROR" : "NETWORK_ERROR",
            message: isCors
                ? "Unable to connect to the server. This may be a configuration issue."
                : "Unable to connect to the server. Please check your internet connection.",
            technicalDetails: `TypeError: ${error.message}`,
            originalError: error,
            timestamp,
            context,
        };
    }

    // Handle standard Error
    if ( error instanceof Error ) {
        return {
            category: "unknown",
            code: "UNKNOWN_ERROR",
            message: getUserMessage( "unknown" ),
            technicalDetails: `${error.name}: ${error.message}`,
            originalError: error,
            timestamp,
            context,
        };
    }

    // Handle unknown error types
    return {
        category: "unknown",
        code: "UNKNOWN_ERROR",
        message: getUserMessage( "unknown" ),
        technicalDetails: String( error ),
        originalError: error,
        timestamp,
        context,
    };
}

/**
 * Log an error with full context for debugging
 */
export function logError( appError: AppError ): void {
    const logData = {
        timestamp: appError.timestamp,
        category: appError.category,
        code: appError.code,
        message: appError.message,
        technicalDetails: appError.technicalDetails,
        context: appError.context,
    };

    // Always log to console in development
    console.error( "[AppError]", logData );

    // Log the original error separately for stack traces
    if ( appError.originalError instanceof Error ) {
        console.error( "[AppError Stack]", appError.originalError );
    }

    // In production, you would send this to a logging service
    // Example: sendToLoggingService(logData);
}

/**
 * Handle an error with logging and toast notification
 */
export function handleError(
    error: unknown,
    context?: Record<string, unknown>
): AppError {
    const appError = createAppError( error, context );
    logError( appError );

    return appError;
}

/**
 * Show error toast with appropriate styling
 */
export function showErrorToast( appError: AppError ): void {
    const description = appError.category === "network"
        ? "Check your connection or try again later."
        : appError.code !== "UNKNOWN_ERROR"
            ? `Error code: ${appError.code}`
            : undefined;

    toast.error( appError.message, {
        description,
        duration: 5000,
    } );
}

/**
 * Combined helper: handle error and show toast
 */
export function handleAndShowError(
    error: unknown,
    context?: Record<string, unknown>
): AppError {
    const appError = handleError( error, context );
    showErrorToast( appError );
    return appError;
}

/**
 * Process a Better Auth result and handle errors if present
 * Returns the error if one occurred, null if successful
 */
export function processBetterAuthResult<T extends { error?: unknown }>(
    result: T,
    context?: Record<string, unknown>
): AppError | null {
    if ( result.error ) {
        return handleAndShowError( result, context );
    }
    return null;
}

/**
 * Show success toast
 */
export function showSuccessToast( message: string, description?: string ): void {
    toast.success( message, {
        description,
        duration: 3000,
    } );
}
