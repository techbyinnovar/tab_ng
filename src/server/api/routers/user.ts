import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      return user;
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user || !user.password) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found or no password set",
        });
      }

      const isValid = await bcrypt.compare(
        input.currentPassword,
        user.password
      );

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          password: hashedPassword,
        },
      });

      return { success: true };
    }),

  // Address management
  addAddress: protectedProcedure
    .input(
      z.object({
        type: z.enum(["SHIPPING", "BILLING", "BOTH"]),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        address1: z.string().min(1),
        address2: z.string().optional().nullable(),
        city: z.string().min(1),
        state: z.string().min(1),
        postalCode: z.string().min(1),
        country: z.string().min(1),
        phone: z.string().optional().nullable(),
        isDefault: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { isDefault, ...addressData } = input;

      // If this is set as default, unset any existing default addresses of the same type
      if (isDefault) {
        await ctx.prisma.address.updateMany({
          where: {
            userId: ctx.session.user.id,
            type: input.type,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });
      }

      const address = await ctx.prisma.address.create({
        data: {
          ...addressData,
          isDefault,
          userId: ctx.session.user.id,
        },
      });

      return address;
    }),

  updateAddress: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["SHIPPING", "BILLING", "BOTH"]).optional(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        address1: z.string().min(1).optional(),
        address2: z.string().optional().nullable(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        postalCode: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        phone: z.string().optional().nullable(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, isDefault, ...addressData } = input;

      // Check if address belongs to user
      const address = await ctx.prisma.address.findUnique({
        where: { id },
      });

      if (!address || address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      // If this is set as default, unset any existing default addresses of the same type
      if (isDefault) {
        await ctx.prisma.address.updateMany({
          where: {
            userId: ctx.session.user.id,
            type: address.type,
            isDefault: true,
            id: { not: id },
          },
          data: {
            isDefault: false,
          },
        });
      }

      const updatedAddress = await ctx.prisma.address.update({
        where: { id },
        data: {
          ...addressData,
          ...(isDefault !== undefined ? { isDefault } : {}),
        },
      });

      return updatedAddress;
    }),

  deleteAddress: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Check if address belongs to user
      const address = await ctx.prisma.address.findUnique({
        where: { id },
      });

      if (!address || address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      await ctx.prisma.address.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Admin procedures
  getAllUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().nullish(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 10, cursor, search } = input || {};

      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (users.length > limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor,
      };
    }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input;

      const user = await ctx.prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return user;
    }),
});
