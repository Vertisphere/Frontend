import { z } from "zod";

export const statuses = ["canceled", "done", "in-progress", "todo", "backlog"] as const;

// export const statuses = ["Active", "Not Active"] as const;

export const labels = ["bug", "feature", "documentation"] as const;
export const priorities = ["low", "medium", "high"] as const;

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(statuses),
  label: z.enum(labels),
  priority: z.enum(priorities),
  due_date: z.date().transform((value) => new Date(value))
})


export const ordersSchema = z.object({
  createdAt: z.date().nullable(),
  createdBy: z.number().nullable(),
  franchiseeId: z.number().nullable(),
  franchiseId: z.number().nullable(),
  invoicedAt: z.date().nullable(),
  invoiceId: z.number().nullable(),
  orderId: z.number(),
  pickedUpAt: z.date().nullable(),
  preparingAt: z.date().nullable(),
  readyAt: z.date().nullable(),
  status: z.string().nullable(),
  totalAmount: z.number(),
  updatedAt: z.date().nullable(),
});

export type TaskType = z.infer<typeof taskSchema>;
export type OrderType = z.infer<typeof ordersSchema>;