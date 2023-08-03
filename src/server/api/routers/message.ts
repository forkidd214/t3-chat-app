import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { pusherServer } from "@/server/pusher";
import {
  NEW_MESSAGE_EVENT,
  MESSAGE_TYPING_EVENT,
  MESSAGE_CHANNEL,
} from "@/utils/pusher";

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
      const {
        prisma,
        session: { user },
      } = ctx;
      const { text } = input;

      const newMessage = await prisma.message.create({
        data: {
          text,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        include: {
          user: true,
        },
      });

      // notify all clients subscribed to MESSAGE_CHANNEL
      void pusherServer.trigger(MESSAGE_CHANNEL, NEW_MESSAGE_EVENT, newMessage);

      return newMessage;
    }),

  typing: protectedProcedure
    .input(
      z.object({
        isTyping: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx.session;
      const { isTyping } = input;

      void pusherServer.trigger(MESSAGE_CHANNEL, MESSAGE_TYPING_EVENT, {
        username: user.name ?? "anonymous",
        isTyping,
      });
    }),
});
