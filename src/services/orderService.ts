import { supabase } from '@/lib/supabase';

export interface OrderItemInput {
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  variant?: string;
}

export interface OrderInput {
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  address?: string;
  paymentMethod?: string;
  status: string;
}

export const orderService = {
  async createOrder(orderData: OrderInput, items: OrderItemInput[]) {
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total: orderData.total,
        status: orderData.status,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  async fetchUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total,
        status,
        order_items (
          id,
          product_id,
          quantity,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
