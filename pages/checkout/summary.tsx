import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts';
import { CartContext } from '@/context';
import { countries } from '@/utils';
import { useRouter } from 'next/router';

const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems } = useContext(CartContext);
  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.push('/checkout/address');
    }
  }, []);

  if (!shippingAddress) return <></>;
  const { firstName, lastName, address, address2, zip, phone, country, city } =
    shippingAddress;
  return (
    <ShopLayout
      title='Resumen de compra'
      pageDescription={'Resumen de la orden'}
    >
      <Typography variant='h1' component='h1'>
        Resumen de la Orden
      </Typography>
      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2'>
                Resumen ({numberOfItems}{' '}
                {numberOfItems === 1 ? 'producto' : 'productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
                <NextLink passHref href='/checkout/address' legacyBehavior>
                  <Link underline='always' color='secondary'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <Typography>{`${firstName} ${lastName}`}</Typography>
              <Typography>
                {address} {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>{zip}</Typography>
              <Typography>{city}</Typography>
              {/* <Typography>
                {countries.find((c) => c.code === country)?.name}
              </Typography> */}
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='end'>
                <NextLink passHref href='/cart' legacyBehavior>
                  <Link underline='always' color='secondary'>
                    Editar
                  </Link>
                </NextLink>
              </Box>

              <OrderSummary />
              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
