import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  // Customer order procedures
  getUserOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().nullish(),
        status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 10, cursor, status } = input || {};
      
      const orders = await ctx.prisma.order.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          userId: ctx.session.user.id,
          ...(status ? { status } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingAddress: true,
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (orders.length > limit) {
        const nextItem = orders.pop();
        nextCursor = nextItem!.id;
      }

      return {
        orders,
        nextCursor,
      };
    }),

  getOrderById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      
      const order = await ctx.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Check if order belongs to user or user is admin
      if (order.userId !== ctx.session.user.id && ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this order",
        });
      }

      return order;
    }),

  createOrder: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            variantId: z.string().optional(),
            quantity: z.number().min(1),
          })
        ),
        shippingAddressId: z.string(),
        billingAddressId: z.string().optional(),
        paymentMethod: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { items, shippingAddressId, billingAddressId, paymentMethod, notes } = input;
      
      // Verify shipping address belongs to user
      const shippingAddress = await ctx.prisma.address.findUnique({
        where: { id: shippingAddressId },
      });

      if (!shippingAddress || shippingAddress.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid shipping address",
        });
      }

      // Verify billing address if provided
      if (billingAddressId) {
        const billingAddress = await ctx.prisma.address.findUnique({
          where: { id: billingAddressId },
        });

        if (!billingAddress || billingAddress.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid billing address",
          });
        }
      }

      // Calculate order total and validate items
      let total = 0;
      const shippingFee = 1000; // $10.00 flat shipping fee
      let tax = 0;
      
      const orderItems = [];

      for (const item of items) {
        const { productId, variantId, quantity } = item;
        
        // Fetch product and variant
        const product = await ctx.prisma.product.findUnique({
          where: { id: productId },
          include: {
            variants: variantId ? {
              where: { id: variantId },
            } : undefined,
          },
        });

        if (!product) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Product not found: ${productId}`,
          });
        }

        let price = product.salePrice || product.price;
        let variant = null;

        if (variantId) {
          variant = product.variants.find(v => v.id === variantId);
          
          if (!variant) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Variant not found: ${variantId}`,
            });
          }

          price = variant.price;
          
          // Check inventory
          if (variant.inventory < quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Not enough inventory for ${product.name} (${variant.size || ''} ${variant.color || ''})`,
            });
          }
        } else {
          // Check inventory
          if (product.inventory < quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Not enough inventory for ${product.name}`,
            });
          }
        }

        const itemTotal = parseFloat(price.toString()) * quantity;
        total += itemTotal;

        orderItems.push({
          productId,
          variantId,
          quantity,
          price,
        });
      }

      // Calculate tax (assuming 7.5% tax rate)
      tax = total * 0.075;
      
      // Create order
      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
          total: total + shippingFee + tax,
          shippingFee,
          tax,
          paymentMethod,
          shippingAddressId,
          billingAddressId: billingAddressId || shippingAddressId,
          notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      // Update inventory
      for (const item of items) {
        const { productId, variantId, quantity } = item;
        
        if (variantId) {
          await ctx.prisma.productVariant.update({
            where: { id: variantId },
            data: {
              inventory: {
                decrement: quantity,
              },
            },
          });
        } else {
          await ctx.prisma.product.update({
            where: { id: productId },
            data: {
              inventory: {
                decrement: quantity,
              },
            },
          });
        }
      }

      return order;
    }),

  cancelOrder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      
      const order = await ctx.prisma.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Check if order belongs to user
      if (order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to cancel this order",
        });
      }

      // Check if order can be cancelled
      if (["SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].includes(order.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Order cannot be cancelled in ${order.status} status`,
        });
      }

      // Update order status
      const updatedOrder = await ctx.prisma.order.update({
        where: { id },
        data: {
          status: "CANCELLED",
        },
      });

      // Restore inventory
      for (const item of order.items) {
        if (item.variantId) {
          await ctx.prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventory: {
                increment: item.quantity,
              },
            },
          });
        } else {
          await ctx.prisma.product.update({
            where: { id: item.productId },
            data: {
              inventory: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      return updatedOrder;
    }),

  // Admin order procedures
  getAllOrders: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().nullish(),
        status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
        userId: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 10, cursor, status, userId } = input || {};
      
      const orders = await ctx.prisma.order.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(status ? { status } : {}),
          ...(userId ? { userId } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (orders.length > limit) {
        const nextItem = orders.pop();
        nextCursor = nextItem!.id;
      }

      return {
        orders,
        nextCursor,
      };
    }),

  updateOrderStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]),
        trackingNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status, trackingNumber } = input;
      
      const order = await ctx.prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Update order
      const updatedOrder = await ctx.prisma.order.update({
        where: { id },
        data: {
          status,
          ...(trackingNumber ? { trackingNumber } : {}),
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedOrder;
    }),
});
