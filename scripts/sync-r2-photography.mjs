import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "lib", "photography.generated.ts");

async function loadEnvFile(filename) {
  try {
    const fileContents = await readFile(path.join(projectRoot, filename), "utf8");

    for (const line of fileContents.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const normalizedValue = rawValue.replace(/^['"]|['"]$/g, "");

      if (!(key in process.env)) {
        process.env[key] = normalizedValue;
      }
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}

await loadEnvFile(".env");
await loadEnvFile(".env.local");

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const prefix = process.env.R2_PHOTOGRAPHY_PREFIX?.trim();
const maxResults = Number.parseInt(process.env.R2_PHOTOGRAPHY_MAX_RESULTS ?? "200", 10);
const deliveryBaseUrl = process.env.NEXT_PUBLIC_PHOTOGRAPHY_DELIVERY_BASE_URL?.replace(/\/+$/, "");

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

invariant(accountId, "Missing R2_ACCOUNT_ID.");
invariant(accessKeyId, "Missing R2_ACCESS_KEY_ID.");
invariant(secretAccessKey, "Missing R2_SECRET_ACCESS_KEY.");
invariant(bucketName, "Missing R2_BUCKET_NAME.");
invariant(deliveryBaseUrl, "Missing NEXT_PUBLIC_PHOTOGRAPHY_DELIVERY_BASE_URL.");

const endpointOrigin = `https://${accountId}.r2.cloudflarestorage.com`;
const service = "s3";
const region = "auto";

function hmac(key, data, encoding) {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest(encoding);
}

function sha256(value, encoding = "hex") {
  return crypto.createHash("sha256").update(value, "utf8").digest(encoding);
}

function getSigningKey(secretKey, dateStamp) {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

function buildAuthHeaders(url, method = "GET") {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256("");
  const canonicalHeaders = [
    `host:${url.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join("\n");
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    method,
    url.pathname,
    url.searchParams.toString(),
    `${canonicalHeaders}\n`,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");
  const signingKey = getSigningKey(secretAccessKey, dateStamp);
  const signature = hmac(signingKey, stringToSign, "hex");
  const authorization = [
    "AWS4-HMAC-SHA256 Credential=",
    `${accessKeyId}/${credentialScope}, `,
    `SignedHeaders=${signedHeaders}, `,
    `Signature=${signature}`,
  ].join("");

  return {
    authorization,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
}

async function fetchSignedText(url) {
  const headers = buildAuthHeaders(url);
  const response = await fetch(url, {
    headers: {
      authorization: headers.authorization,
      "x-amz-content-sha256": headers["x-amz-content-sha256"],
      "x-amz-date": headers["x-amz-date"],
    },
  });

  if (!response.ok) {
    throw new Error(`R2 request failed (${response.status}): ${await response.text()}`);
  }

  return response.text();
}

function extractTagValue(xml, tagName) {
  const expression = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "g");
  return [...xml.matchAll(expression)].map((match) => match[1]);
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

async function listObjects() {
  const objects = [];
  let continuationToken = "";

  do {
    const url = new URL(`${endpointOrigin}/${bucketName}`);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("max-keys", String(Math.min(maxResults, 1000)));

    if (prefix) {
      url.searchParams.set("prefix", prefix);
    }

    if (continuationToken) {
      url.searchParams.set("continuation-token", continuationToken);
    }

    const xml = await fetchSignedText(url);
    const contents = [...xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)].map(
      (match) => match[1],
    );

    for (const content of contents) {
      const key = decodeXml(extractTagValue(content, "Key")[0] ?? "");
      const lastModified = extractTagValue(content, "LastModified")[0];

      if (key && !key.endsWith("/")) {
        objects.push({ key, lastModified });
      }
    }

    const isTruncated = extractTagValue(xml, "IsTruncated")[0] === "true";
    continuationToken = isTruncated
      ? decodeXml(extractTagValue(xml, "NextContinuationToken")[0] ?? "")
      : "";
  } while (continuationToken && objects.length < maxResults);

  return objects.slice(0, maxResults);
}

function readableLabelFromKey(key) {
  const filename = key.split("/").pop() ?? key;
  const stem = filename.replace(/\.[a-z0-9]+$/i, "");
  return stem
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function slugFromKey(key) {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/\//g, "-")
    .replace(/^-+|-+$/g, "");
}

function tagsFromKey(key) {
  const segments = key.split("/").filter(Boolean);
  if (segments.length <= 2) {
    return [];
  }

  return [...new Set(segments.slice(1, -1).map((segment) => segment.toLowerCase()))];
}

function formatCapturedAt(value) {
  if (!value) {
    return undefined;
  }

  const exifMatch = /^(\d{4}):(\d{2}):(\d{2})(?:\s+\d{2}:\d{2}:\d{2})?$/.exec(value.trim());

  if (exifMatch) {
    const [, year, month] = exifMatch;
    const monthIndex = Number.parseInt(month, 10) - 1;
    const monthLabel = new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2000, monthIndex, 1)));

    return `${monthLabel} ${year}`;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parsed);
}

async function fetchBytes(url, byteCount) {
  const response = await fetch(url, {
    headers: {
      Range: `bytes=0-${byteCount - 1}`,
    },
  });

  if (!response.ok && response.status !== 206) {
    throw new Error(`Failed to fetch image bytes (${response.status}) for ${url}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

function readAscii(bytes, offset, length) {
  if (offset < 0 || length <= 0 || offset + length > bytes.length) {
    return null;
  }

  return new TextDecoder()
    .decode(bytes.slice(offset, offset + length))
    .replace(/\0+$/, "")
    .trim();
}

function readUInt32BigEndian(bytes, offset) {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

function readUInt16BigEndian(bytes, offset) {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function readUInt16LittleEndian(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readUInt32LittleEndian(bytes, offset) {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  );
}

function readUInt16(bytes, offset, littleEndian) {
  return littleEndian ? readUInt16LittleEndian(bytes, offset) : readUInt16BigEndian(bytes, offset);
}

function readUInt32(bytes, offset, littleEndian) {
  return littleEndian ? readUInt32LittleEndian(bytes, offset) : readUInt32BigEndian(bytes, offset);
}

function getTiffValueOffset(entryOffset, count, tiffStart, bytes, littleEndian) {
  if (count <= 4) {
    return entryOffset + 8;
  }

  const relativeOffset = readUInt32(bytes, entryOffset + 8, littleEndian);
  return tiffStart + relativeOffset;
}

function findAsciiTagValue(bytes, tiffStart, ifdOffset, littleEndian, tagIds) {
  if (!ifdOffset) {
    return null;
  }

  const directoryOffset = tiffStart + ifdOffset;

  if (directoryOffset + 2 > bytes.length) {
    return null;
  }

  const entryCount = readUInt16(bytes, directoryOffset, littleEndian);

  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = directoryOffset + 2 + index * 12;

    if (entryOffset + 12 > bytes.length) {
      return null;
    }

    const tagId = readUInt16(bytes, entryOffset, littleEndian);

    if (!tagIds.includes(tagId)) {
      continue;
    }

    const type = readUInt16(bytes, entryOffset + 2, littleEndian);
    const count = readUInt32(bytes, entryOffset + 4, littleEndian);

    if (type !== 2 || count <= 1) {
      continue;
    }

    const valueOffset = getTiffValueOffset(entryOffset, count, tiffStart, bytes, littleEndian);

    return readAscii(bytes, valueOffset, count);
  }

  return null;
}

function findLongTagValue(bytes, tiffStart, ifdOffset, littleEndian, tagId) {
  if (!ifdOffset) {
    return null;
  }

  const directoryOffset = tiffStart + ifdOffset;

  if (directoryOffset + 2 > bytes.length) {
    return null;
  }

  const entryCount = readUInt16(bytes, directoryOffset, littleEndian);

  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = directoryOffset + 2 + index * 12;

    if (entryOffset + 12 > bytes.length) {
      return null;
    }

    if (readUInt16(bytes, entryOffset, littleEndian) !== tagId) {
      continue;
    }

    const type = readUInt16(bytes, entryOffset + 2, littleEndian);
    const count = readUInt32(bytes, entryOffset + 4, littleEndian);

    if (![3, 4].includes(type) || count !== 1) {
      continue;
    }

    if (type === 3) {
      return readUInt16(bytes, entryOffset + 8, littleEndian);
    }

    return readUInt32(bytes, entryOffset + 8, littleEndian);
  }

  return null;
}

function detectJpegExifCapturedAt(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];

    if (!marker || marker === 0xd9 || marker === 0xda) {
      break;
    }

    const segmentLength = readUInt16BigEndian(bytes, offset + 2);

    if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length) {
      break;
    }

    if (marker === 0xe1) {
      const exifHeader = readAscii(bytes, offset + 4, 6);

      if (exifHeader === "Exif") {
        const tiffStart = offset + 10;

        if (tiffStart + 8 > bytes.length) {
          return null;
        }

        const byteOrder = readAscii(bytes, tiffStart, 2);
        const littleEndian = byteOrder === "II" ? true : byteOrder === "MM" ? false : null;

        if (littleEndian === null) {
          return null;
        }

        const ifd0Offset = readUInt32(bytes, tiffStart + 4, littleEndian);
        const exifIfdOffset = findLongTagValue(bytes, tiffStart, ifd0Offset, littleEndian, 0x8769);

        const exifDate =
          findAsciiTagValue(bytes, tiffStart, exifIfdOffset, littleEndian, [0x9003, 0x9004]) ??
          findAsciiTagValue(bytes, tiffStart, ifd0Offset, littleEndian, [0x0132]);

        return exifDate;
      }
    }

    offset += 2 + segmentLength;
  }

  return null;
}

function detectPngDimensions(bytes) {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  const isPng = signature.every((value, index) => bytes[index] === value);
  if (!isPng || bytes.length < 24) {
    return null;
  }

  return {
    width: readUInt32BigEndian(bytes, 16),
    height: readUInt32BigEndian(bytes, 20),
  };
}

function detectGifDimensions(bytes) {
  const header = new TextDecoder().decode(bytes.slice(0, 6));
  if (!header.startsWith("GIF") || bytes.length < 10) {
    return null;
  }

  return {
    width: readUInt16LittleEndian(bytes, 6),
    height: readUInt16LittleEndian(bytes, 8),
  };
}

function detectWebpDimensions(bytes) {
  const riff = new TextDecoder().decode(bytes.slice(0, 4));
  const webp = new TextDecoder().decode(bytes.slice(8, 12));
  if (riff !== "RIFF" || webp !== "WEBP") {
    return null;
  }

  const chunkType = new TextDecoder().decode(bytes.slice(12, 16));

  if (chunkType === "VP8X" && bytes.length >= 30) {
    const width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
    const height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
    return { width, height };
  }

  if (chunkType === "VP8 " && bytes.length >= 30) {
    return {
      width: readUInt16LittleEndian(bytes, 26) & 0x3fff,
      height: readUInt16LittleEndian(bytes, 28) & 0x3fff,
    };
  }

  if (chunkType === "VP8L" && bytes.length >= 25) {
    const value = bytes[21] | (bytes[22] << 8) | (bytes[23] << 16) | (bytes[24] << 24);
    return {
      width: (value & 0x3fff) + 1,
      height: ((value >> 14) & 0x3fff) + 1,
    };
  }

  return null;
}

function detectJpegDimensions(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    if (!marker) {
      break;
    }

    if (marker === 0xd9 || marker === 0xda) {
      break;
    }

    const segmentLength = readUInt16BigEndian(bytes, offset + 2);
    const isSofMarker = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isSofMarker && offset + 8 < bytes.length) {
      return {
        height: readUInt16BigEndian(bytes, offset + 5),
        width: readUInt16BigEndian(bytes, offset + 7),
      };
    }

    offset += 2 + segmentLength;
  }

  return null;
}

function detectImageDimensions(bytes) {
  return (
    detectPngDimensions(bytes) ??
    detectGifDimensions(bytes) ??
    detectWebpDimensions(bytes) ??
    detectJpegDimensions(bytes)
  );
}

async function inspectImage(key) {
  const assetUrl = `${deliveryBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const bytes = await fetchBytes(assetUrl, 262144);
  const dimensions = detectImageDimensions(bytes);

  if (!dimensions) {
    throw new Error(`Unable to detect dimensions for ${key}`);
  }

  return {
    ...dimensions,
    capturedAtRaw: detectJpegExifCapturedAt(bytes),
  };
}

async function buildBlurDataUrl(key) {
  const transformedUrl = `${deliveryBaseUrl}/cdn-cgi/image/width=24,quality=40,format=webp/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  const response = await fetch(transformedUrl);

  if (!response.ok) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "image/webp";
  const arrayBuffer = await response.arrayBuffer();
  return `data:${contentType};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}

async function normalizeObject(objectInfo) {
  const imageData = await inspectImage(objectInfo.key);
  const title = readableLabelFromKey(objectInfo.key);
  const capturedAt = formatCapturedAt(imageData.capturedAtRaw ?? objectInfo.lastModified);

  return {
    id: objectInfo.key,
    slug: slugFromKey(objectInfo.key),
    alt: title,
    title,
    capturedAt,
    width: imageData.width,
    height: imageData.height,
    blurDataUrl: await buildBlurDataUrl(objectInfo.key),
    storageKey: objectInfo.key,
    tags: tagsFromKey(objectInfo.key),
  };
}

function buildGeneratedFile(photos) {
  const serializedPhotos = JSON.stringify(photos, null, 2);

  return [
    'import type { PhotoItem } from "@/lib/photography";',
    "",
    `export const generatedPhotographyPhotosSource: PhotoItem[] = ${serializedPhotos};`,
    "",
  ].join("\n");
}

async function main() {
  const objects = await listObjects();
  const photos = [];

  for (const objectInfo of objects) {
    const key = objectInfo.key.toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif"].some((extension) =>
      key.endsWith(extension),
    );

    if (!isImage) {
      continue;
    }

    photos.push(await normalizeObject(objectInfo));
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buildGeneratedFile(photos), "utf8");

  console.log(`Synced ${photos.length} photography assets to lib/photography.generated.ts.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
