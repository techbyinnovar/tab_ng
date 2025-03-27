import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        includeSubcategories: z.boolean().optional().default(false),
        parentId: z.string().optional().nullable(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { includeSubcategories = false, parentId = null } = input || {};
      
      const categories = await ctx.prisma.category.findMany({
        where: {
          parentId: parentId,
        },
        include: {
          ...(includeSubcategories
            ? {
                subcategories: {
                  include: {
                    subcategories: true,
                  },
                },
              }
            : {}),
        },
        orderBy: {
          name: "asc",
        },
      });

      return categories;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      
      const category = await ctx.prisma.category.findUnique({
        where: { id },
        include: {
          subcategories: true,
          parent: true,
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;
      
      const category = await ctx.prisma.category.findUnique({
        where: { slug },
        include: {
          subcategories: true,
          parent: true,
          products: {
            take: 10,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().nullable(),
        image: z.string().nullable().optional(),
        slug: z.string().min(1),
        parentId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Creating category with data:", input);
      
      try {
        const category = await ctx.prisma.category.create({
          data: input,
          include: {
            parent: true,
          },
        });
        
        return category;
      } catch (error) {
        console.error("Error creating category:", error);
        throw error;
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().nullable(),
        image: z.string().nullable().optional(),
        slug: z.string().min(1),
        parentId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Updating category with data:", input);
      
      try {
        const { id, ...data } = input;
        
        const category = await ctx.prisma.category.update({
          where: { id },
          data,
          include: {
            parent: true,
            subcategories: true,
          },
        });
        
        return category;
      } catch (error) {
        console.error("Error updating category:", error);
        throw error;
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      
      // Check if category has products
      const productsCount = await ctx.prisma.product.count({
        where: { categoryId: id },
      });

      if (productsCount > 0) {
        throw new Error("Cannot delete category with products");
      }

      // Check if category has subcategories
      const subcategoriesCount = await ctx.prisma.category.count({
        where: { parentId: id },
      });

      if (subcategoriesCount > 0) {
        throw new Error("Cannot delete category with subcategories");
      }

      await ctx.prisma.category.delete({
        where: { id },
      });

      return { success: true };
    }),
});
