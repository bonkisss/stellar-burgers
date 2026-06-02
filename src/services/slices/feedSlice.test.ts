import { feedReducer, fetchFeeds } from './feedSlice';

const order = {
  _id: 'order-id',
  status: 'done',
  name: 'Бургер',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  number: 1,
  ingredients: ['ingredient-id']
};

describe('feedReducer', () => {
  it('sets loading on request', () => {
    const state = feedReducer(undefined, fetchFeeds.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores feed on success', () => {
    const state = feedReducer(
      undefined,
      fetchFeeds.fulfilled(
        { success: true, orders: [order], total: 10, totalToday: 2 },
        ''
      )
    );

    expect(state.orders).toEqual([order]);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
    expect(state.isLoading).toBe(false);
  });

  it('stores error on failed request', () => {
    const state = feedReducer(
      undefined,
      fetchFeeds.rejected(new Error('Ошибка ленты'), '')
    );

    expect(state.error).toBe('Ошибка ленты');
    expect(state.isLoading).toBe(false);
  });
});
