import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const adminRouter = createTRPCRouter({
  // Dashboard stats
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    // Get total revenue
    const orders = await ctx.prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      select: {
        total: true,
      },
    });
    
    const totalRevenue = orders.reduce(
      (acc, order) => acc + Number(order.total),
      0
    );

    // Get total orders
    const totalOrders = await ctx.prisma.order.count();

    // Get total products
    const totalProducts = await ctx.prisma.product.count();

    // Get total customers
    const totalCustomers = await ctx.prisma.user.count({
      where: {
        role: "USER",
      },
    });

    // Get recent orders
    const recentOrders = await ctx.prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Get monthly revenue for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyOrders = await ctx.prisma.order.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        paymentStatus: "PAID",
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Group by month and calculate revenue
    const monthlyRevenue: Record<string, number> = {};
    
    monthlyOrders.forEach((order) => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM format
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(order.total);
    });

    // Convert to array for chart data
    const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    // Sort by month
    revenueData.sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
      revenueData,
    };
  }),

  // Users management
  getAllUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 50, cursor, search, role } = input || {};
      
      const users = await ctx.prisma.user.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          } : {}),
          ...(role ? { role } : {}),
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

  getUserDetails: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        include: {
          orders: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
          addresses: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Calculate total spent
      const orders = await ctx.prisma.order.findMany({
        where: {
          userId: id,
          paymentStatus: "PAID",
        },
        select: {
          total: true,
        },
      });
      
      const totalSpent = orders.reduce(
        (acc, order) => acc + Number(order.total),
        0
      );

      return {
        ...user,
        totalSpent,
      };
    }),

  createUser: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["USER", "ADMIN"]).default("USER"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password, role } = input;
      
      // Check if user with email already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    }),

  updateUser: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
        password: z.string().min(8).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, password, ...data } = input;
      
      // Check if user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // If email is being updated, check if it's already in use
      if (data.email && data.email !== existingUser.email) {
        const emailInUse = await ctx.prisma.user.findUnique({
          where: { email: data.email },
        });

        if (emailInUse) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email is already in use",
          });
        }
      }

      // Update user
      const updatedUser = await ctx.prisma.user.update({
        where: { id },
        data: {
          ...data,
          ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    }),

  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      
      // Check if user exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Don't allow deleting the current admin
      if (existingUser.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete your own account",
        });
      }

      // Delete user
      await ctx.prisma.user.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Orders management
  getAllOrders: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().nullish(),
        search: z.string().optional(),
        status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
        paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 50, cursor, search, status, paymentStatus } = input || {};
      
      const orders = await ctx.prisma.order.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...(search ? {
            OR: [
              { id: { contains: search } },
              { user: { 
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ]
              }},
            ],
          } : {}),
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
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
              image: true,
            },
          },
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
        paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
        trackingNumber: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status, paymentStatus, trackingNumber, notes } = input;
      
      // Check if order exists
      const existingOrder = await ctx.prisma.order.findUnique({
        where: { id },
      });

      if (!existingOrder) {
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
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(trackingNumber ? { trackingNumber } : {}),
          ...(notes ? { notes } : {}),
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
              variant: true,
            },
          },
        },
      });

      return updatedOrder;
    }),

  // Product stats
  getProductStats: adminProcedure.query(async ({ ctx }) => {
    // Get total products
    const totalProducts = await ctx.prisma.product.count();

    // Get low inventory products (less than 5 items)
    const lowInventory = await ctx.prisma.product.count({
      where: {
        inventory: {
          lt: 5,
        },
      },
    });

    // Get out of stock products
    const outOfStock = await ctx.prisma.product.count({
      where: {
        inventory: 0,
      },
    });

    // Get featured products count
    const featured = await ctx.prisma.product.count({
      where: {
        featured: true,
      },
    });

    // Get top selling products
    const orderItems = await ctx.prisma.orderItem.findMany({
      include: {
        product: true,
      },
    });

    const productSales: Record<string, { count: number; revenue: number; name: string }> = {};

    orderItems.forEach((item) => {
      const productId = item.productId;
      if (!productSales[productId]) {
        productSales[productId] = {
          count: 0,
          revenue: 0,
          name: item.product.name,
        };
      }
      
      productSales[productId].count += item.quantity;
      productSales[productId].revenue += Number(item.price) * item.quantity;
    });

    const topSellingProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalProducts,
      lowInventory,
      outOfStock,
      featured,
      topSellingProducts,
    };
  }),
});
