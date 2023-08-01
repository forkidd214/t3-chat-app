import PusherClient from "pusher-js";
import { env } from "@/env.mjs";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

export const MESSAGE_CHANNEL = "privateChannelForMessage";
export const NEW_MESSAGE_EVENT = "NEW_MESSAGE";
export const MESSAGE_TYPING_EVENT = "MESSAGE_TYPING";
