import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsIsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedIsLoading = (state: RootState) => state.feed.isLoading;
export const selectFeed = (state: RootState) => state.feed;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersIsLoading = (state: RootState) =>
  state.profileOrders.isLoading;

export const selectFeedAndProfileOrders = createSelector(
  [selectFeedOrders, selectProfileOrders],
  (feedOrders, profileOrders) => [...feedOrders, ...profileOrders]
);

export const selectUser = (state: RootState) => state.user.user;
export const selectUserState = (state: RootState) => state.user;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;

export const selectConstructorState = (state: RootState) =>
  state.burgerConstructor;
