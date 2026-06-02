import {
  addIngredient,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Космическая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main: TIngredient = {
  _id: 'main-id',
  name: 'Галактическая начинка',
  type: 'main',
  proteins: 11,
  fat: 21,
  carbohydrates: 31,
  calories: 41,
  price: 200,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauce: TIngredient = {
  _id: 'sauce-id',
  name: 'Звездный соус',
  type: 'sauce',
  proteins: 12,
  fat: 22,
  carbohydrates: 32,
  calories: 42,
  price: 50,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('constructorReducer', () => {
  it('adds bun to constructor', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.constructorItems.bun).toEqual(expect.objectContaining(bun));
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('adds filling ingredient to constructor', () => {
    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining(main)
    );
    expect(state.constructorItems.ingredients[0].id).toEqual(
      expect.any(String)
    );
  });

  it('removes filling ingredient from constructor', () => {
    const ingredient: TConstructorIngredient = { ...main, id: 'main-1' };
    const state = constructorReducer(
      {
        constructorItems: { bun: null, ingredients: [ingredient] },
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      removeIngredient('main-1')
    );

    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('moves filling ingredients in constructor', () => {
    const first: TConstructorIngredient = { ...main, id: 'main-1' };
    const second: TConstructorIngredient = { ...sauce, id: 'sauce-1' };
    const state = constructorReducer(
      {
        constructorItems: { bun: null, ingredients: [first, second] },
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      moveIngredient({ index: 1, direction: 'up' })
    );

    expect(state.constructorItems.ingredients.map((item) => item.id)).toEqual([
      'sauce-1',
      'main-1'
    ]);
  });
});
