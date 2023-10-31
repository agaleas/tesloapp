import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';

const KidsPage: NextPage = () => {
  const { products, isError, isLoading } = useProducts('/products/?gender=kid');
  return (
    <ShopLayout
      title={'Teslo Shop - Kids'}
      pageDescription={'Encuentra los mejores productos para niño'}
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Productos para niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsPage;
