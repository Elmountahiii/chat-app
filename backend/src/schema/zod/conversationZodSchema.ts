import z from "zod";

export const createConversationSchema = z.object({
	participants: z
		.array(
			z.string().min(2, "Participant ID must be at least 2 characters long"),
		)
		.min(1, "At least one participant is required"),
	type: z.enum(["individual", "group"]),
	groupName: z.string().min(2).max(100).optional(),
	groupAdmin: z.string().optional(),
});
