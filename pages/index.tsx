import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const HomePage: NextPage = () => {
  const { products, isError, isLoading } = useProducts('/products');
  return (
    <ShopLayout
      title={'Teslo Shop - Home'}
      pageDescription={'Encuentra los mejores productos'}
    >
      <Typography variant='h1' component='h1'>
        Buscar producto
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
