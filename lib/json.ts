export const toJson = (d: unknown) => {
  return JSON.stringify(d, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
};

export const toApiFilterResult = (data: unknown[]) => {
  return {
    data: data.map((item) => ({
      value: item,
    })),
  };
};
