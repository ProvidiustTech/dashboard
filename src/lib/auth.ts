// lib/auth.ts
// ─────────────────────────────────────────────────────────────────────────────
// All auth calls MUST use credentials: 'include' so the browser sends/receives
// cookies. Without this the Set-Cookie header from FastAPI is ignored.
// ─────────────────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:8000

export interface AuthResult {
  ok: boolean;
  fullName?: string;
  error?: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',          // ← CRITICAL: lets browser store the HttpOnly cookie
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.detail ?? 'Login failed' };
  }

  const data = await res.json();
  return { ok: true, fullName: data.full_name };
}

export async function registerUser(
  email: string,
  password: string,
  company: string,
): Promise<AuthResult> {
  const res = await fetch(`${API}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',          // ← CRITICAL
    body: JSON.stringify({ email, password, company }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.detail ?? 'Registration failed' };
  }

  const data = await res.json();
  return { ok: true, fullName: data.full_name };
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',          // ← CRITICAL: sends cookie so server can clear it
  });
}

// ─── Usage in your login page ─────────────────────────────────────────────────
//
// 'use client';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { loginUser } from '@/lib/auth';
//
// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//
//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const form = new FormData(e.currentTarget);
//
//     const result = await loginUser(
//       form.get('email') as string,
//       form.get('password') as string,
//     );
//
//     if (result.ok) {
//       // Redirect to where they were trying to go, or default to /dashboard
//       const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
//       router.replace(decodeURIComponent(callbackUrl));
//     } else {
//       setError(result.error);
//     }
//   }
// }