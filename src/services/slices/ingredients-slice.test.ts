import { ingredientsReducer, fetchIngredients } from './ingredients-slice';

describe('ingredients slice reducer', () => {
  const ingredient = {
    _id: 'ing-1',
    name: 'Ингредиент',
    type: 'main',
    proteins: 12,
    fat: 3,
    carbohydrates: 14,
    calories: 130,
    price: 25,
    image: 'ing.png',
    image_large: 'ing-large.png',
    image_mobile: 'ing-mobile.png'
  };

  it('should set isLoading=true on request action', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should write items and set isLoading=false on success action', () => {
    const prevState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      prevState,
      fetchIngredients.fulfilled([ingredient], 'request-id', undefined)
    );

    expect(state.items).toEqual([ingredient]);
    expect(state.isLoading).toBe(false);
  });

  it('should write error and set isLoading=false on failed action', () => {
    const prevState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      prevState,
      fetchIngredients.rejected(
        new Error('Ошибка загрузки'),
        'request-id',
        undefined
      )
    );

    expect(state.error).toBe('Ошибка загрузки');
    expect(state.isLoading).toBe(false);
  });
});

