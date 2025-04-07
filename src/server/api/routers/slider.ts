import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";

export const sliderRouter = createTRPCRouter({
  // Get all sliders
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const sliders = await ctx.prisma.slider.findMany({
        orderBy: {
          order: 'asc',
        },
      });
      
      return sliders;
    }),

  // Get active sliders for homepage
  getActive: publicProcedure
    .query(async ({ ctx }) => {
      const sliders = await ctx.prisma.slider.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
      
      return sliders;
    }),

  // Get a single slider by ID
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const slider = await ctx.prisma.slider.findUnique({
        where: {
          id: input.id,
        },
      });
      
      return slider;
    }),

  // Create a new slider
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        subtitle: z.string().nullable().optional(),
        imageUrl: z.string().min(1),
        buttonText: z.string().nullable().optional(),
        buttonLink: z.string().nullable().optional(),
        order: z.number().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slider = await ctx.prisma.slider.create({
        data: input,
      });
      
      return slider;
    }),

  // Update an existing slider
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        subtitle: z.string().nullable().optional(),
        imageUrl: z.string().min(1),
        buttonText: z.string().nullable().optional(),
        buttonLink: z.string().nullable().optional(),
        order: z.number(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      const slider = await ctx.prisma.slider.update({
        where: {
          id,
        },
        data,
      });
      
      return slider;
    }),

  // Delete a slider
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.slider.delete({
        where: {
          id: input.id,
        },
      });
      
      return { success: true };
    }),

  // Update slider order
  updateOrder: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          order: z.number(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const updates = input.map(item => 
        ctx.prisma.slider.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      );
      
      await ctx.prisma.$transaction(updates);
      
      return { success: true };
    }),
});
