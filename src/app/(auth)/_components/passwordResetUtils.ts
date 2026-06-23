export const RESET_EMAIL_STORAGE_KEY = "freshcart-reset-email";

interface ApiErrorLike {
  data?: {
    message?: string;
    errors?: Array<{ msg?: string }>;
  };
  error?: string;
}

export function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const normalized = error as ApiErrorLike;

  if (normalized.data?.errors?.[0]?.msg) {
    return normalized.data.errors[0].msg;
  }

  if (normalized.data?.message) {
    return normalized.data.message;
  }

  if (normalized.error) {
    return normalized.error;
  }

  return "Something went wrong. Please try again.";
}

export function persistResetEmail(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, email);
}

export function readPersistedResetEmail(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY);
}

export function clearPersistedResetEmail() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(RESET_EMAIL_STORAGE_KEY);
}
