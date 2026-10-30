/**
 * Thin wrapper around the form-submission API (API Gateway + Lambda).
 *
 * In development, set NEXT_PUBLIC_API_URL in .env.local:
 *   NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Role = { id: string; title: string; team: string; location: string; type: string; summary: string; do: string[]; need: string[]; jdKey?: string };

export const jdDownloadUrl = (roleId: string) => `${BASE}/jd/${encodeURIComponent(roleId)}`;

export async function getOpenRoles(): Promise<Role[]> {
  try {
    const res = await fetch(`${BASE}/roles`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return (await res.json()).roles ?? [];
  } catch {
    return [];
  }
}

const API_TIMEOUT_MS = 20_000;
const UPLOAD_TIMEOUT_MS = 90_000;
export const MAX_CV_BYTES = 5 * 1024 * 1024;

async function timedFetch(url: string, init: RequestInit, ms: number) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(ms) });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new Error("This is taking too long. Check your connection and try again.");
    }
    throw err;
  }
}

export async function submitForm(formType: string, data: Record<string, string>) {
  const res = await timedFetch(`${BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formType, ...data }),
  }, API_TIMEOUT_MS);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Submission failed. Please try again.");
  }
  return res.json() as Promise<{ message: string; id: string }>;
}

export async function getUploadUrl(fileName: string, contentType: string) {
  const res = await timedFetch(`${BASE}/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, contentType }),
  }, API_TIMEOUT_MS);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Could not prepare upload. Please try again.");
  }
  return res.json() as Promise<{ uploadUrl: string; key: string }>;
}

export async function uploadFile(file: File) {
  const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
  const res = await timedFetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  }, UPLOAD_TIMEOUT_MS);
  if (!res.ok) throw new Error("File upload failed. Please try again.");
  return key;
}
