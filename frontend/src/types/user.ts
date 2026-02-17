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
