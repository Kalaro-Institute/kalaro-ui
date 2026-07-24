export interface RegistrationOptions {
  current_roles: Record<string, string>;
  experience_levels: Record<string, string>;
  goals: Record<string, string>;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  current_role: string;
  experience_level: string;
  goal: string;
  agreed_to_terms: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface GoogleLoginRequest {
  id_token: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  new_password: string;
}

export type UserRole = "student" | "instructor" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  email_verified: boolean;
  current_role: string;
  experience_level: string;
  goal: string;
  avatar_url?: string;
}

export interface InviteAcceptRequest {
  token: string;
  password: string;
  first_name: string;
  last_name: string;
}
