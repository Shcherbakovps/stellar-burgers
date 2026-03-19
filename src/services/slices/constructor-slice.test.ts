import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructor-slice';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

describe('burgerConstructor slice reducer', () => {
  const bun = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  };

  const mainOne = {
    _id: 'main-1',
    name: 'Начинка 1',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 200,
    price: 80,
    image: 'main1.png',
    image_large: 'main1-large.png',
    image_mobile: 'main1-mobile.png'
  };

  const mainTwo = {
    _id: 'main-2',
    name: 'Начинка 2',
    type: 'main',
    proteins: 18,
    fat: 9,
    carbohydrates: 7,
    calories: 180,
    price: 70,
    image: 'main2.png',
    image_large: 'main2-large.png',
    image_mobile: 'main2-mobile.png'
  };

  it('should handle addIngredient action', () => {
    const stateAfterBun = constructorReducer(undefined, addIngredient(bun));
    expect(stateAfterBun.bun?._id).toBe('bun-1');

    const stateAfterMain = constructorReducer(
      stateAfterBun,
      addIngredient(mainOne)
    );

    expect(stateAfterMain.ingredients).toHaveLength(1);
    expect(stateAfterMain.ingredients[0]).toMatchObject({
      _id: 'main-1',
      id: 'test-uuid'
    });
  });

  it('should handle removeIngredient action', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mainOne, id: 'id-1' },
        { ...mainTwo, id: 'id-2' }
      ]
    };

    const nextState = constructorReducer(initialState, removeIngredient('id-1'));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('id-2');
  });

  it('should handle moveIngredient action', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mainOne, id: 'id-1' },
        { ...mainTwo, id: 'id-2' }
      ]
    };

    const nextState = constructorReducer(
      initialState,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(nextState.ingredients[0].id).toBe('id-2');
    expect(nextState.ingredients[1].id).toBe('id-1');
  });
});

