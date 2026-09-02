import { existsSync } from "node:fs";
import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/*
 * Local photo editing. Uploads are refused outside development so a deployed
 * build never exposes a public write endpoint.
 */

const PHOTO_DIR = path.join(process.cwd(), "public", "profile");
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 8 * 1024 * 1024;

const isDev = process.env.NODE_ENV !== "production";

async function findPhoto() {
  for (const ext of ["jpg", "png", "webp", "gif"]) {
    const file = path.join(PHOTO_DIR, `photo.${ext}`);
    if (existsSync(file)) {
      const info = await stat(file);
      return { ext, url: `/profile/photo.${ext}?v=${info.mtimeMs}` };
    }
  }
  return null;
}

async function removeExisting() {
  for (const ext of ["jpg", "png", "webp", "gif"]) {
    const file = path.join(PHOTO_DIR, `photo.${ext}`);
    if (existsSync(file)) await unlink(file);
  }
}

export async function GET() {
  const photo = await findPhoto();
  return NextResponse.json({ exists: Boolean(photo), url: photo?.url ?? null, editable: isDev });
}

export async function POST(request: Request) {
  if (!isDev) {
    return NextResponse.json({ error: "Photo editing is only available in local development." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  // Extension comes from the validated MIME type, never the uploaded filename.
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, or GIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 8 MB." }, { status: 400 });
  }

  await mkdir(PHOTO_DIR, { recursive: true });
  await removeExisting();
  await writeFile(path.join(PHOTO_DIR, `photo.${ext}`), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ exists: true, url: `/profile/photo.${ext}?v=${Date.now()}`, editable: true });
}

export async function DELETE() {
  if (!isDev) {
    return NextResponse.json({ error: "Photo editing is only available in local development." }, { status: 403 });
  }
  await removeExisting();
  return NextResponse.json({ exists: false, url: null, editable: true });
}
