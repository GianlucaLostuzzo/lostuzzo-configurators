export type ApiProductResult = {
  data: {
    description?: string;
    product_code: string;
    image?: string;
    brand?: string;
    manufacter?: string;
  }[];
};

export type ApiFilterResult = {
  data: { value: string }[];
};
