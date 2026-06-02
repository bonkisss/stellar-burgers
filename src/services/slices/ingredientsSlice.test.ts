import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'ingredient-id',
  name: 'Ингредиент',
  type: 'main',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 5,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

describe('ingredientsReducer', () => {
  it('sets loading on request', () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending(''));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores ingredients on success', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled([ingredient], '')
    );

    expect(state.items).toEqual([ingredient]);
    expect(state.isLoading).toBe(false);
  });

  it('stores error on failed request', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('Ошибка'), '')
    );

    expect(state.error).toBe('Ошибка');
    expect(state.isLoading).toBe(false);
  });
});
