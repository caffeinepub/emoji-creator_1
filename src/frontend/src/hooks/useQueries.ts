import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EmojiConfig as BackendEmojiConfig } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllEmojis() {
  const { actor, isFetching } = useActor();
  return useQuery<BackendEmojiConfig[]>({
    queryKey: ["emojis"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmojiConfigs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveEmoji() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: BackendEmojiConfig) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveEmoji(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emojis"] });
    },
  });
}

export function useSeedEmojis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.seedSampleEmojis();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emojis"] });
    },
  });
}
