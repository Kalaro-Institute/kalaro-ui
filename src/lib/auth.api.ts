import {
  apiRequest,
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken,
} from "./api-client";
import type {
  AuthUser,
  GoogleLoginRequest,
  InviteAcceptRequest,
  LoginRequest,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RegisterRequest,
  RegistrationOptions,
  ResendCodeRequest,
  TokenPair,
  VerifyEmailRequest,
} from "./auth.types";

export async function fetchRegistrationOptions(): Promise<RegistrationOptions> {
  return apiRequest<RegistrationOptions>("/auth/registration-options", {
    skipAuth: true,
  });
}

export async function register(data: RegisterRequest): Promise<void> {
  await apiRequest<void>("/auth/register", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await apiRequest<void>("/auth/verify-email", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function resendCode(data: ResendCodeRequest): Promise<void> {
  await apiRequest<void>("/auth/resend-code", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function login(data: LoginRequest): Promise<TokenPair> {
  const tokens = await apiRequest<TokenPair>("/auth/login", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
  setAccessToken(tokens.access);
  setRefreshToken(tokens.refresh);
  return tokens;
}

export async function googleLogin(
  data: GoogleLoginRequest,
): Promise<TokenPair> {
  const tokens = await apiRequest<TokenPair>("/auth/google", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
  setAccessToken(tokens.access);
  setRefreshToken(tokens.refresh);
  return tokens;
}

export async function logout(): Promise<void> {
  clearAccessToken();
  clearRefreshToken();
}

export async function requestPasswordReset(
  data: PasswordResetRequestPayload,
): Promise<void> {
  await apiRequest<void>("/auth/password-reset/request", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function confirmPasswordReset(
  data: PasswordResetConfirmPayload,
): Promise<void> {
  await apiRequest<void>("/auth/password-reset/confirm", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}

export async function getMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}

export async function updateMe(
  data: Partial<Pick<AuthUser, "first_name" | "last_name" | "avatar_url">>,
): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me", {
    method: "PATCH",
    body: data,
  });
}

export async function acceptInvite(data: InviteAcceptRequest): Promise<void> {
  await apiRequest<void>("/auth/invites/accept", {
    method: "POST",
    body: data,
    skipAuth: true,
  });
}
