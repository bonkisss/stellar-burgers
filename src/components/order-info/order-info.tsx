import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { useSelector } from '../../services/store';
import {
  selectFeedAndProfileOrders,
  selectIngredients
} from '../../services/selectors';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orderNumber = Number(number);
  const [loadedOrder, setLoadedOrder] = useState<TOrder | null>(null);

  const ingredients = useSelector(selectIngredients);
  const orders = useSelector(selectFeedAndProfileOrders);

  const orderData = useMemo(
    () => orders.find((order) => order.number === orderNumber) || loadedOrder,
    [loadedOrder, orderNumber, orders]
  );

  useEffect(() => {
    if (!orderNumber || orderData) return;

    getOrderByNumberApi(orderNumber).then((data) => {
      setLoadedOrder(data.orders[0] || null);
    });
  }, [orderData, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
