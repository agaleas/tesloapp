import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { Order, Product, User } from '@/models';

type Data = {
  numberOfOrders: number;
  paidOrders: number; //isPaid: true
  notPaidOrders: number;
  numberOfClients: number; //client
  numberOfProducts: number;
  productsWithoutInventory: number; //0
  lowInventory: number; //10 o menos
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    lowInventory,
    numberOfProducts,
    productsWithoutInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: 'client' }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);
  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    lowInventory,
    numberOfProducts,
    productsWithoutInventory,
  });
}
