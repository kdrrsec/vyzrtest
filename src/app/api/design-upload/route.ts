import { storeDesignFile } from "@/lib/designUpload/server";
import type { CustomizerSetupId, VisorSlotId } from "@/lib/customizerSetup";

const SETUPS = new Set<CustomizerSetupId>(["single", "double", "full"]);
const SLOTS = new Set<VisorSlotId>(["left", "right", "top"]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const setup = String(form.get("setup") ?? "").trim();
    const slot = String(form.get("slot") ?? "").trim();

    if (!(file instanceof File)) {
      return Response.json({ error: "Missing file." }, { status: 400 });
    }
    if (!SETUPS.has(setup as CustomizerSetupId)) {
      return Response.json({ error: "Invalid setup." }, { status: 400 });
    }
    if (!SLOTS.has(slot as VisorSlotId)) {
      return Response.json({ error: "Invalid slot." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const baseUrl = new URL(request.url).origin;
    const url = await storeDesignFile(bytes, file.type || "application/octet-stream", {
      setup,
      slot,
    }, { baseUrl });

    return Response.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    const status = message.includes("not configured") ? 503 : 400;
    return Response.json({ error: message }, { status });
  }
}
