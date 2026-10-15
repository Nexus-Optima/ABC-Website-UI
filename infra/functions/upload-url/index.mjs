import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const s3 = new S3Client();
const BUCKET = process.env.BUCKET_NAME;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function handler(event) {
  try {
    const { fileName, contentType } = JSON.parse(event.body || "{}");

    if (!fileName || !contentType) {
      return respond(400, { error: "fileName and contentType are required." });
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return respond(400, { error: "Only PDF and DOCX files are allowed." });
    }

    const ext = fileName.split(".").pop()?.toLowerCase() || "pdf";
    const key = `cvs/${randomUUID()}.${ext}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 300 },
    );

    return respond(200, { uploadUrl, key });
  } catch (err) {
    console.error("Upload-url error:", err);
    return respond(500, { error: "Internal server error." });
  }
}

function respond(statusCode, body) {
  return { statusCode, headers: cors, body: JSON.stringify(body) };
}
