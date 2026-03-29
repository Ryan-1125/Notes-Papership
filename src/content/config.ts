import { defineCollection, z } from "astro:content";

const _postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection = defineCollection({
	schema: z.object({
		title: z.string().optional(),
		// 知隅页面新增：学习资源列表
		resources: z
			.array(
				z.object({
					name: z.string(),
					description: z.string(),
					link: z.string(),
					icon: z.string().optional(),
				}),
			)
			.optional(),
		// 其他字段...
	}),
});

export const collections = {
	spec: specCollection,
};
