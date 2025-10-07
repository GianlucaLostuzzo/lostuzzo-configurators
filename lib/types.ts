export type ApiProductResult = {
  data: {
    description?: string;
    product_code: string;
    image?: string;
    brand?: string;
    manufacter?: string;
    manufacturer?: string;
    fixTypes?: Array<{
      code: string;
      type: number;
    }>;
  }[];
};

export type ApiFilterResult = {
  data: { value: string }[];
};
