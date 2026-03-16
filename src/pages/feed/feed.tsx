import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllOrders } from '../../services/slices/orders-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const isLoading = useSelector((state) => state.orders.isLoading);
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  if (isLoading || !orders.length || !ingredients.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getAllOrders())} />
  );
};
