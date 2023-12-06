import { createSlice } from "@reduxjs/toolkit";
import {
    createProduct,
    deleteProduct,
    getProducts,
    getSingleProduct,
    updateProduct
} from "../../thunks/products";
import { ProductType } from "@/common/types/product";

const initialState = {
    products: [],
    product: {}
};

export const productsSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        deleteProductFromState: (state, action) => {
            state.products = state.products.filter(
                (product: ProductType) => product._id !== action.payload.id
            );
        },

        clearState: (state) => {
            state.product = {};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload;
        });

        builder.addCase(getSingleProduct.fulfilled, (state, action) => {
            state.product = action.payload;
        });
    }
});

export const { deleteProductFromState, clearState } = productsSlice.actions;
export default productsSlice.reducer;
