import { supabase } from './supabase';
import type { Advisory, AdvisoryRequest } from './schema';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ------------------------------------------------------------------
// Helper: get the current session token for Authorization header
// ------------------------------------------------------------------
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ------------------------------------------------------------------
// Error normaliser
// ------------------------------------------------------------------
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ------------------------------------------------------------------
// POST /api/advisories/generate
// ------------------------------------------------------------------
export async function generateAdvisory(
  params: AdvisoryRequest
): Promise<{ id: string; advisory: Advisory }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/api/advisories/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  return handleResponse<{ id: string; advisory: Advisory }>(res);
}

// ------------------------------------------------------------------
// GET /api/advisories
// ------------------------------------------------------------------
export async function getAdvisories(): Promise<{ advisories: Advisory[] }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/api/advisories`, { headers });
  return handleResponse<{ advisories: Advisory[] }>(res);
}

// ------------------------------------------------------------------
// GET /api/advisories/:id
// ------------------------------------------------------------------
export async function getAdvisoryById(
  id: string
): Promise<{ advisory: Advisory }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/api/advisories/${id}`, { headers });
  return handleResponse<{ advisory: Advisory }>(res);
}

// ------------------------------------------------------------------
// DELETE /api/advisories/:id
// ------------------------------------------------------------------
export async function deleteAdvisory(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/api/advisories/${id}`, {
    method: 'DELETE',
    headers,
  });
  await handleResponse<{ message: string }>(res);
}
