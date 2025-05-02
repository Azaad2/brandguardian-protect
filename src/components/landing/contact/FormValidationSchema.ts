
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(1, {
    message: "Please enter your company name.",
  }),
  marketplaces: z.string().min(1, {
    message: "Please select at least one marketplace.",
  }),
  amazonLink: z.string().url({
    message: "Please enter a valid Amazon URL.",
  }).optional().or(z.literal('')),
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
