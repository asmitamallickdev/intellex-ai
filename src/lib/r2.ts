import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const endpoint = process.env.R2_ENDPOINT;

// Fallback configuration for compile/build safety
const r2Endpoint = endpoint || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "https://dummy-account.r2.cloudflarestorage.com");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: accessKeyId || "dummy-access-key",
    secretAccessKey: secretAccessKey || "dummy-secret-key",
  },
  // Ensure path-style routing works correctly on S3 compatible storage
  forcePathStyle: true,
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "intellex-knowledge-base";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-dummy.r2.dev";
export default r2Client;
