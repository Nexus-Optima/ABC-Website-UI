/**
 * Thin wrapper around the form-submission API (API Gateway + Lambda).
 *
 * In development, set NEXT_PUBLIC_API_URL in .env.local:
 *   NEXT_PUBLIC_API_URL=https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function submitForm(formType: string, data: Record<string, string>) {
  const res = await fetch(`${BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formType, ...data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Submission failed. Please try again.");
  }
  return res.json() as Promise<{ message: string; id: string }>;
}

export async function getUploadUrl(fileName: string, contentType: string) {
  const res = await fetch(`${BASE}/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, contentType }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Could not prepare upload. Please try again.");
  }
  return res.json() as Promise<{ uploadUrl: string; key: string }>;
}

export async function uploadFile(file: File) {
  const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("File upload failed. Please try again.");
  return key;
}
