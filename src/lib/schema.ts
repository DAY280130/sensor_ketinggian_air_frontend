import * as z from "zod";

export const dataSchema = z.object({
  message: z.string(),
  depthStatus: z.enum(["checked", "unchecked"]),
  depth: z.number(),
  level1Breakpoint: z.number(),
  level2Breakpoint: z.number(),
  level3Breakpoint: z.number(),
  sonarStatus: z.enum(["active", "inactive"]),
  waterStatus: z.enum(["unchecked", "low", "safe", "be warned", "dangerous"]),
  waterLevel: z.number(),
});
