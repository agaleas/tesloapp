import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';

type Data = { message: string } | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'GET':
      return getProductBySlug(req, res);

    default:
      return res.status(400).json({ message: 'Enpoint no existe' });
  }
}

async function getProductBySlug(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { slug } = req.query;
  await db.connect();
  const product = await Product.findOne({ slug })
    // .select('title images price inStock slug description -_id')
    .lean();
  await db.disconnect();

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Quitar este fragmento si se usan solo imagenes de la nube
  product.images = product.images.map((image) => {
    return image.includes('https')
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });

  res.status(200).json(product);
}
