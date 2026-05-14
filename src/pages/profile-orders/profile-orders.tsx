import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectProfileOrders,
  selectProfileOrdersIsLoading
} from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersIsLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
