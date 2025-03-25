import { createTRPCRouter } from "./trpc";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { userRouter } from "./routers/user";
import { orderRouter } from "./routers/order";
import { adminRouter } from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  user: userRouter,
  order: orderRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
