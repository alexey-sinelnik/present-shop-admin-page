import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "@/store/thunks/categories";
import { CategoryInitialState } from "@/common/types/category";

const initialState: CategoryInitialState = {
    categories: []
};

export const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
        });
    }
});

export const {} = categoriesSlice.actions;
export default categoriesSlice.reducer;
