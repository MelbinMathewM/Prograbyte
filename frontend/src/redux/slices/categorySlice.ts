import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Category} from '@/types/course';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
        const updated = action.payload;
        state.categories = state.categories.map((cat) =>
          cat._id === updated._id ? updated : cat
        );
    },  
    deleteCategory: (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.categories = state.categories.filter((cat) => 
          cat._id !== id
        );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory, setLoading, setError } = categorySlice.actions;
export default categorySlice.reducer;
