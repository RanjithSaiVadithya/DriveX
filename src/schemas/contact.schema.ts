import { z } from "zod";
import { contactSchema } from "@/schemas/auth.schema";

export { contactSchema };
export type ContactInput = z.infer<typeof contactSchema>;
