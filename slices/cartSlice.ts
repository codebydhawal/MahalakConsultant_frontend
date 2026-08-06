import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartSummaryResponse } from "../services/CartSummaryResponse";

interface CartState {
  cart: CartSummaryResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartSummaryResponse>) {
      state.cart = action.payload;
      state.loading = false;
      state.error = null;
    },

    clearCartState(state) {
      state.cart = null;
      state.loading = false;
      state.error = null;
    },

    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCart,
  clearCartState,
  setCartLoading,
  setCartError,
} = cartSlice.actions;

export default cartSlice.reducer;