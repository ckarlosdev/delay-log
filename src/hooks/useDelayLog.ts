import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DelayLog } from "../types";
import { api } from "./apiConfig";

const createDelayLog = async ({ reportData }: { reportData: DelayLog }) => {
  if (reportData.id) {
    return api.put(`v2/delay-log/${reportData.id}`, reportData);
  }
  return api.post(`v2/delay-log`, reportData);
};

export function useSaveDelayLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDelayLog,
    mutationKey: ["delayLog"],
    onSuccess: (response) => {
      const newId = response.data?.id;
      if (newId) {
        queryClient.invalidateQueries({ queryKey: ["delayLog", newId] });
      }
    },
  });
}

const finalizeDelay = async ({ delayId }: { delayId: number }) => {
  return api.put(`v2/delay-log/${delayId}/finalize`);
};

export function useFinalize() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeDelay,
    mutationKey: ["finalizeDelay"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delayLog"] });
    },
  });
}

const queryGetDelayById = async (delayId: number): Promise<DelayLog> => {
  const { data } = await api.get(`v2/delay-log/${delayId}`);
  return data;
};

export function useGetDelayLog(delayId: number) {
  return useQuery({
    queryKey: ["delayLog", delayId],
    queryFn: () => queryGetDelayById(delayId),
    enabled: !!delayId,
    retry: false,
  });
}
