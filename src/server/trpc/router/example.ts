import { t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const exampleRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.example.create({
        data: {
          id: input.id,
        },
      });

      return post;
    }),

  getPaginated: t.procedure
    .input(z.object({ foo: z.string(), cursor: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      const { cursor } = input;

      const posts = await ctx.prisma.example.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
        cursor: cursor ? { id: cursor } : undefined,
      });

      if (!Array.isArray(posts)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting posts",
        });
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > 3) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id || "";
      }

      return { posts, nextCursor };
    }),
});
