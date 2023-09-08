import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts';
import { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { CartContext } from '@/context';
import { useRouter } from 'next/router';

const CartPage = () => {
  const { isLoaded, numberOfItems } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {
    if (isLoaded && numberOfItems === 0) {
      router.replace('/cart/empty');
    }
  }, [isLoaded, numberOfItems, router]);

  if (!isLoaded || numberOfItems === 0) return <></>;

  return (
    <ShopLayout
      title='Carrito - 3'
      pageDescription={'Carrito de compras de la tienda0'}
    >
      <Typography variant='h1' component='h1'>
        Carrito
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button
                  color='secondary'
                  className='circular-btn'
                  fullWidth
                  href='/checkout/address'
                >
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
