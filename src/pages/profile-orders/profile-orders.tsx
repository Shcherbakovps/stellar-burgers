import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/slices/orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.userOrders);
  const isLoading = useSelector((state) => state.orders.isLoading);
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (isLoading || !ingredients.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
