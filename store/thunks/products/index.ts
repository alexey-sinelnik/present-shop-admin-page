import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/utils/axios";
import { ProductFormProps } from "@/common/types/product";

export const createProduct = createAsyncThunk(
    "products/create-product",
    async (data: ProductFormProps, { rejectWithValue }) => {
        try {
            const product = await instance.post("products", data);
            return product.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/update-product",
    async (data: ProductFormProps, { rejectWithValue }) => {
        try {
            const product = await instance.put("products", { ...data });
            return product.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const getProducts = createAsyncThunk(
    "products/get-products",
    async (_, { rejectWithValue }) => {
        try {
            const products = await instance.get("products");
            return products.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/delete-product",
    async (id: string, { rejectWithValue }) => {
        try {
            const product = await instance.delete(`products?id=${id}`);
            return product.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const getSingleProduct = createAsyncThunk(
    "products/single-product",
    async (id: string, { rejectWithValue }) => {
        try {
            const product = await instance.get(`products?id=${id}`);
            return product.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);
