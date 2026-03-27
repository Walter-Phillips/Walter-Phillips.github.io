import { buildLlmsText } from "@/lib/llms";

export async function GET() {
  return new Response(await buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
