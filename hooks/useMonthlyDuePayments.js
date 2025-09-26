import useSWR from "swr";
import { startOfMonth, endOfMonth, formatISO } from "date-fns";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useMonthlyDuePayments(monthDate) {
  const from = formatISO(startOfMonth(monthDate), { representation: "date" });
  const to = formatISO(endOfMonth(monthDate), { representation: "date" });

  const { data, isLoading, error, mutate } = useSWR(`/api/payments/due?from=${from}&to=${to}`, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    payments: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}
