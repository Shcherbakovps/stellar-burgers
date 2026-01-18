import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { orderBurgerApi } from '@api';
import { clearConstructor } from '../../services/slices/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const user = useSelector((state) => state.auth.user);

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = async () => {
    if (!bun || orderRequest) return;

    // Проверка авторизации
    if (!user) {
      navigate('/login');
      return;
    }

    setOrderRequest(true);

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    try {
      const response = await orderBurgerApi(ingredientsIds);
      if (response.success && response.order) {
        setOrderModalData(response.order);
        dispatch(clearConstructor());
      }
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
