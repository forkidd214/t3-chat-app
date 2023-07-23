import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const messageRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: true,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        text: z.string().trim().min(1, "Text should not be empty!"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { text } = input;
      const id = session?.user.id;

      return await prisma.message.create({
        data: {
          text,
          user: {
            connect: {
              id,
            },
          },
        },
      });
    }),

  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
