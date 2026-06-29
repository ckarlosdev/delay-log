import { useQuery } from "@tanstack/react-query";
import type { OptionItem } from "../types";
import { api } from "./apiConfig";

const queryOptions = (): Promise<OptionItem[]> => {
  return api.get("v2/delay-log/options").then((response) => response.data);
};

function useOptions() {
  return useQuery({
    queryKey: ["options"],
    queryFn: queryOptions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

export default useOptions;
