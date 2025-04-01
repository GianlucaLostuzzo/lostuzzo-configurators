export type ApiProductResult = {
  data: {
    description?: string;
    product_code: string;
    image?: string;
    brand?: string;
  }[];
};

export type ApiFilterResult = {
  data: { value: string }[];
};
