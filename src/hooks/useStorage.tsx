import { useCallback } from 'react';
import { Order } from '../types/Order';

const storageKey = 'orders';

export default function useStorage() {
  const getOrders = useCallback((): Order[] => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? '[]') as Order[];
    } catch {
      return [];
    }
  }, []);

  const saveOrders = useCallback((orders: Order[]) => {
    localStorage.setItem(storageKey, JSON.stringify(orders));
  }, []);

  const addOrder = useCallback(
    (order: Order) => {
      saveOrders([...getOrders(), order]);
    },
    [getOrders, saveOrders],
  );

  const removeOrder = useCallback(
    (spot: string) => {
      saveOrders(getOrders().filter((order) => order.spot !== spot));
    },
    [getOrders, saveOrders],
  );

  return { getOrders, addOrder, removeOrder };
}
