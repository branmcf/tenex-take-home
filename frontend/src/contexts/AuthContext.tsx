"use client";

import {
    createContext,
    useContext,
    useMemo,
    type ReactNode,
} from "react";
import { useSession, signOut as authSignOut, authClient } from "@/lib/auth-client";

export type AuthProvider = "email" | "google" | "github";

export interface User {
    id: string;
    email: string;
    name: string;
    initials: string;
    image?: string;
    emailVerified: boolean;
    provider: AuthProvider;
}

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signOut: () => Promise<void>;
    updateName: ( newName: string ) => Promise<void>;
    updateEmail: ( newEmail: string ) => Promise<void>;
    changePassword: ( currentPassword: string, newPassword: string ) => Promise<void>;
    refetch: () => void;
}

const AuthContext = createContext<AuthContextValue | null>( null );

function getInitials( name: string ): string {
    return name
        .split( " " )
        .map( ( n ) => n[ 0 ] )
        .join( "" )
        .toUpperCase()
        .slice( 0, 2 );
}

export function AuthProvider( { children }: { children: ReactNode } ) {
    const { data: session, isPending, refetch } = useSession();

    const user: User | null = useMemo( () => {
        if ( !session?.user ) return null;

        // Determine provider - if user has an image URL from Google/GitHub, they're OAuth
        // This is a heuristic; ideally we'd fetch account data from the API
        const hasOAuthImage = session.user.image?.includes( "googleusercontent" )
            || session.user.image?.includes( "githubusercontent" );
        const provider: AuthProvider = hasOAuthImage
            ? ( session.user.image?.includes( "googleusercontent" ) ? "google" : "github" )
            : "email";

        return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            initials: getInitials( session.user.name ),
            image: session.user.image ?? undefined,
            emailVerified: session.user.emailVerified,
            provider,
        };
    }, [ session ] );

    const signOut = async () => {
        await authSignOut();
        window.location.href = "/login";
    };

    const updateName = async ( newName: string ) => {
        if ( newName.trim().length < 1 ) {
            throw new Error( "Name is required" );
        }

        await authClient.updateUser( {
            name: newName,
        } );

        refetch();
    };

    const updateEmail = async ( newEmail: string ) => {
        if ( !newEmail.includes( "@" ) ) {
            throw new Error( "Invalid email address" );
        }

        await authClient.changeEmail( {
            newEmail,
        } );

        refetch();
    };

    const changePassword = async ( currentPassword: string, newPassword: string ) => {
        if ( currentPassword.length < 1 ) {
            throw new Error( "Current password is required" );
        }
        if ( newPassword.length < 8 ) {
            throw new Error( "New password must be at least 8 characters" );
        }

        await authClient.changePassword( {
            currentPassword,
            newPassword,
        } );
    };

    const value: AuthContextValue = {
        user,
        isLoading: isPending,
        isAuthenticated: !!user,
        signOut,
        updateName,
        updateEmail,
        changePassword,
        refetch,
    };

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext( AuthContext );
    if ( !context ) {
        throw new Error( "useAuth must be used within an AuthProvider" );
    }
    return context;
}
