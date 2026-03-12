import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || "igj-website-media-prod";
const bucket = storage.bucket(bucketName);

export async function uploadToGCS(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: { contentType },
    resumable: false,
  });

  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

export { bucket, bucketName };
