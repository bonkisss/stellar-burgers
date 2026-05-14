import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { fetchFeeds } from './feedSlice';
import { fetchProfileOrders } from './profileOrdersSlice';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: { number: number } | null;
  error: string | null;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const data = await orderBurgerApi(ingredients);
    dispatch(fetchFeeds());
    dispatch(fetchProfileOrders());
    return data.order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
          return;
        }

        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= state.constructorItems.ingredients.length
      ) {
        return;
      }

      const currentIngredient = state.constructorItems.ingredients[index];
      state.constructorItems.ingredients[index] =
        state.constructorItems.ingredients[targetIndex];
      state.constructorItems.ingredients[targetIndex] = currentIngredient;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = { number: action.payload.number };
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  closeOrderModal
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
