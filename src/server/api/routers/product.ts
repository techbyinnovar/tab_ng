import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().nullish(),
        categoryId: z.string().optional(),
        featured: z.boolean().optional(),
        isNew: z.boolean().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, categoryId, featured, isNew, search } = input;
      
      const items = await ctx.prisma.product.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(categoryId ? { categoryId } : {}),
          ...(featured !== undefined ? { featured } : {}),
          ...(isNew !== undefined ? { isNew } : {}),
          ...(search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
          variants: true,
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      
      const product = await ctx.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          variants: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    }),
    
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;
      
      const product = await ctx.prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          variants: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    }),

  create: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().positive(),
        salePrice: z.number().positive().optional(),
        inventory: z.number().min(0).default(0),
        images: z.array(z.string()).min(1),
        featured: z.boolean().default(false),
        isNew: z.boolean().default(true),
        categoryId: z.string(),
        variants: z.array(
          z.object({
            size: z.string().optional(),
            color: z.string().optional(),
            material: z.string().optional(),
            style: z.string().optional(),
            sku: z.string(),
            price: z.number().positive(),
            inventory: z.number().min(0).default(0),
            images: z.array(z.string()).optional(),
          })
        ).optional(),
        material: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Creating product with data:", input);
        
        const { variants, ...productData } = input;
        
        // Generate a slug from the product name
        const slug = input.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with hyphens
          .replace(/-+/g, '-');     // Replace multiple hyphens with a single hyphen
        
        // Create the product with all fields including a generated slug
        const product = await ctx.prisma.product.create({
          data: {
            ...productData,
            slug, // Add the generated slug
            ...(variants && variants.length > 0
              ? {
                  variants: {
                    create: variants,
                  },
                }
              : {}),
          },
          include: {
            variants: true,
            category: true,
          },
        });
        
        return product;
      } catch (error) {
        console.error("Error creating product:", error);
        throw error;
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        price: z.number().positive().optional(),
        salePrice: z.number().positive().optional().nullable(),
        inventory: z.number().min(0).optional(),
        images: z.array(z.string()).min(1).optional(),
        featured: z.boolean().optional(),
        isNew: z.boolean().optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      const product = await ctx.prisma.product.update({
        where: { id },
        data,
        include: {
          variants: true,
          category: true,
        },
      });

      return product;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      
      await ctx.prisma.product.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Additional procedures for product variants, reviews, etc.
  createReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, rating, title, comment } = input;
      
      const review = await ctx.prisma.review.create({
        data: {
          productId,
          userId: ctx.session.user.id,
          rating,
          title,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return review;
    }),
});
