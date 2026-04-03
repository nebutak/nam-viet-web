import { z } from "zod";

export const newsSchema = z.object({
    title: z.string()
        .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
        .max(255, "Tiêu đề không được quá 255 ký tự"),
    slug: z.string()
        .min(10, "Slug phải có ít nhất 10 ký tự")
        .max(255, "Slug không được quá 255 ký tự"),
    excerpt: z.string().max(500, "Tóm tắt không được quá 500 ký tự").optional(),
    content: z.string()
        .min(50, "Nội dung phải có ít nhất 50 ký tự"),
    contentType: z.enum(["article", "video"]).optional().default("article"),
    featuredImage: z.string().optional(),
    videoFile: z.string().optional(),
    videoThumbnail: z.string().optional(),
    videoDuration: z.number().int().positive().optional(),
    categoryId: z.number().int().positive("Vui lòng chọn danh mục"),
    status: z.enum(["draft", "published", "archived"]).optional().default("draft"),
    publishedAt: z.string().datetime().optional(),
    isFeatured: z.boolean().optional().default(false),
    metaTitle: z.string().max(255).optional(),
    metaDescription: z.string().max(500).optional(),
    metaKeywords: z.string().max(255).optional(),
});

export const filterNewsSchema = z.object({
    categoryId: z.number().int().positive().optional(),
    contentType: z.enum(["article", "video"]).optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    isFeatured: z.boolean().optional(),
    search: z.string().trim().optional(),
});

export const newsCategorySchema = z.object({
    categoryKey: z.string()
        .min(2, "Mã danh mục phải có ít nhất 2 ký tự")
        .max(50, "Mã danh mục không được quá 50 ký tự"),
    categoryName: z.string()
        .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
        .max(100, "Tên danh mục không được quá 100 ký tự"),
    description: z.string().max(500).optional(),
    slug: z.string()
        .min(2, "Slug phải có ít nhất 2 ký tự")
        .max(100, "Slug không được quá 100 ký tự"),
    displayOrder: z.number().int().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
});

export const newsTagSchema = z.object({
    tagName: z.string()
        .min(2, "Tên tag phải có ít nhất 2 ký tự")
        .max(50, "Tên tag không được quá 50 ký tự"),
    slug: z.string()
        .min(2, "Slug phải có ít nhất 2 ký tự")
        .max(50, "Slug không được quá 50 ký tự"),
});

export type NewsFormData = z.infer<typeof newsSchema>;
export type FilterNewsData = z.infer<typeof filterNewsSchema>;
export type NewsCategoryFormData = z.infer<typeof newsCategorySchema>;
export type NewsTagFormData = z.infer<typeof newsTagSchema>;
