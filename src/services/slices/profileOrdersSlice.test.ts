import { fetchProfileOrders, profileOrdersReducer } from './profileOrdersSlice';

const order = {
  _id: 'profile-order-id',
  status: 'done',
  name: 'Профильный бургер',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  number: 2,
  ingredients: ['ingredient-id']
};

describe('profileOrdersReducer', () => {
  it('sets loading on request', () => {
    const state = profileOrdersReducer(
      undefined,
      fetchProfileOrders.pending('')
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores orders on success', () => {
    const state = profileOrdersReducer(
      undefined,
      fetchProfileOrders.fulfilled([order], '')
    );

    expect(state.orders).toEqual([order]);
    expect(state.isLoading).toBe(false);
  });

  it('stores error on failed request', () => {
    const state = profileOrdersReducer(
      undefined,
      fetchProfileOrders.rejected(new Error('Ошибка заказов'), '')
    );

    expect(state.error).toBe('Ошибка заказов');
    expect(state.isLoading).toBe(false);
  });
});
