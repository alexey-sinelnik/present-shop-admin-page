import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "@/utils/axios";

export const createCategory = createAsyncThunk(
    "categories/update-category",
    async (data: any, { rejectWithValue }) => {
        try {
            const categories = await instance.post("categories", data);
            return categories.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const getCategories = createAsyncThunk(
    "categories/get-categories",
    async (_, { rejectWithValue }) => {
        try {
            const categories = await instance.get("categories");
            return categories.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/update-category",
    async (data: any, { rejectWithValue }) => {
        try {
            const categories = await instance.put("categories", data);
            return categories.data;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/update-category",
    async (_id: string, { rejectWithValue }) => {
        try {
            return instance.delete(`categories?_id=${_id}`);
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);
