import { db, seedDatabase } from '@/database';
import { Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'No tiene acceso a este servicio' });
  }

  switch (req.method) {
    case 'GET':
    case 'POST':
    case 'PUT':
      return populateDatabase(res);

    default:
      return res.status(400).json({ message: 'Endpoint no existe' });
  }
}

const populateDatabase = async (res: NextApiResponse<Data>) => {
  await db.connect();

  await User.deleteMany();
  await User.insertMany(seedDatabase.initialData.users);

  await Product.deleteMany();
  await Product.insertMany(seedDatabase.initialData.products);

  await db.disconnect();

  res.status(200).json({ message: 'Process Successfuly' });
};
