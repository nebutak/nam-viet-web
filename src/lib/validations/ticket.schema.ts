import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  customerId: z.number().min(1, "Vui lòng chọn khách hàng"),
  assignedToId: z.number().optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
});

export const updateTicketSchema = createTicketSchema.extend({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
export type UpdateTicketSchema = z.infer<typeof updateTicketSchema>;
