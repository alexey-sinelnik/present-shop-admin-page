export type ProductType = {
    category: string;
    description: string;
    images: [string];
    price: number;
    properties: {};
    title: string;
    __v: number;
    _id: string;
};

export type ProductFormProps = {
    _id?: string;
    title?: string;
    description?: string;
    price?: number | string;
    images?: string[];
    category?: string;
    properties?: any;
};
