import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().optional(),
  productName: z
    .string()
    .min(1, "Tên sản phẩm là bắt buộc")
    .max(200, "Tên sản phẩm không được quá 200 ký tự"),
  productType: z.enum(["raw_material", "packaging", "finished_product", "goods"])
    .refine((val) => val, { message: "Loại sản phẩm là bắt buộc" })
  ,
  packagingType: z.enum(["bottle", "box", "bag", "label", "other"]).optional(),
  categoryId: z.number().int().positive().optional().nullable(),
  supplierId: z.number().int().positive().optional().nullable(),
  unit: z
    .string()
    .min(1, "Đơn vị tính là bắt buộc")
    .max(50, "Đơn vị tính không được quá 50 ký tự"),
  barcode: z.string().max(100).optional(),
  weight: z.number().nonnegative().optional().nullable(),
  dimensions: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  purchasePrice: z.number().nonnegative().optional().nullable(),
  sellingPriceRetail: z.number().nonnegative().optional().nullable(),
  sellingPriceWholesale: z.number().nonnegative().optional().nullable(),
  sellingPriceVip: z.number().nonnegative().optional().nullable(),
  taxRate: z.number().min(0).max(100).default(0),
  minStockLevel: z.number().nonnegative().default(0),
  expiryDate: z.string().optional().nullable(),
  status: z.enum(["active", "inactive", "discontinued"]),
}).refine(
  (data) => {
    // Nếu là packaging thì phải có packagingType
    if (data.productType === "packaging" && !data.packagingType) {
      return false;
    }
    return true;
  },
  {
    message: "Loại bao bì là bắt buộc khi sản phẩm là bao bì",
    path: ["packagingType"],
  }
);

export type ProductFormData = z.infer<typeof productSchema>;

