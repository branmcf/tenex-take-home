import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3026",
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    sendVerificationEmail,
} = authClient;
