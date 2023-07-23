import type {
  RouterInputs,
  RouterOutputs,
  ReactQueryOptions,
} from "@/utils/api";
import { api } from "@/utils/api";

/**
 * type helpers
 *
 */
type MessageOptions<T extends keyof ReactQueryOptions["message"]> =
  ReactQueryOptions["message"][T];
type MessageInputs<T extends keyof RouterInputs["message"]> =
  RouterInputs["message"][T];
type MessageOutputs<T extends keyof RouterOutputs["message"]> =
  RouterOutputs["message"][T];

type MessageList = MessageOutputs<"list">;
type MessageCreateInput = MessageInputs<"create">;

/**
 * all hooks for message router
 *
 */
const useMessageList = (opts?: MessageOptions<"list">) =>
  api.message.list.useQuery(undefined, opts);

const useMessageCreate = (opts?: MessageOptions<"create">) =>
  api.message.create.useMutation(opts);

/**
 * export types and hooks
 *
 */
export type { MessageList, MessageCreateInput };
export { useMessageList, useMessageCreate };
