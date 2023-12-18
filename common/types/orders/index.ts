export type OrderType = {
    line_items: RootLineItems[];
    name: string;
    city: string;
    email: string;
    postalCode: string;
    street: string;
    country: string;
    paid: boolean;
    _id: string;
    createdAt: string;
};

export type RootLineItems = {
    quantity: number;
    price_data: PriceData;
};
type PriceData = {
    currency: string;
    product_data: ProductData;
    unit_amount: number;
};
type ProductData = {
    name: string;
};
