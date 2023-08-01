import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { pusherServer } from "@/server/pusher";
import { NEW_MESSAGE_EVENT, MESSAGE_CHANNEL } from "@/utils/pusher";
import cuid from "cuid";

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
      const { user } = session;

      const newMessage = {
        id: cuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        text,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      };

      // notify all clients subscribed to MESSAGE_CHANNEL
      void pusherServer.trigger(MESSAGE_CHANNEL, NEW_MESSAGE_EVENT, newMessage);

      return await prisma.message.create({
        data: {
          ...newMessage,
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
    }),
});
