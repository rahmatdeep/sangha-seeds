export function toISODateRange(from?: string, to?: string) {
  const createdFrom = from
    ? new Date(from).toISOString().split("T")[0] + "T00:00:00.000Z"
    : undefined;
  const createdTo = to
    ? new Date(to).toISOString().split("T")[0] + "T23:59:59.999Z"
    : undefined;
  return { createdFrom, createdTo };
}
