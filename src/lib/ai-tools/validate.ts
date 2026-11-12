import { z } from "zod";
import type { AiTool } from "./registry";

export type ToolInput = Record<string, string | undefined>;

/** Builds the server-side input schema for a tool from its field definitions. */
export function inputSchemaFor(tool: AiTool) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of tool.fields) {
    let base = z.string().trim().max(f.maxLength, `Please keep this under ${f.maxLength} characters.`);
    if (f.required) base = base.min(1, "This field is required.");
    const opts = f.type === "select" ? f.options : undefined;
    const field = opts ? base.refine((v) => (v === "" ? !f.required : opts.includes(v)), "Please choose one of the options.") : base;
    shape[f.name] = f.required ? field : field.optional();
  }
  return z.object(shape).strict();
}
