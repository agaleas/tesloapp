import { ShopLayout } from '@/components/layouts';
import { Box, Typography } from '@mui/material';

const NotFoundPage = () => {
  return (
    <ShopLayout title={'Nada que mostrar'} pageDescription={'Page not Found'}>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Typography variant='h1' component='h1' fontSize={60} fontWeight={200}>
          404 |
        </Typography>
        <Typography marginLeft={2}>No encontramos nada aquí</Typography>
      </Box>
    </ShopLayout>
  );
};

export default NotFoundPage;
