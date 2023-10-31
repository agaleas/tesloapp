import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { Chip, Grid, Typography, Link } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { ShopLayout } from '@/components/layouts';
import { authOptions } from '../api/auth/[...nextauth]';
import { getOrdersByUser } from '@/database/dbOrders';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Nombre Completo', width: 300 },

  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra info. de la órden si está pagada o no.',
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color='success' label='Pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='No pagada' variant='outlined' />
      );
    },
  },
  {
    field: 'order',
    headerName: 'Ver orden',
    description: 'Enlace a la orden',
    sortable: false,
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink
          href={`/orders/${params.row.orderId}`}
          passHref
          legacyBehavior
        >
          <Link underline='always' color='secondary'>
            Ver orden
          </Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, idx) => ({
    id: idx + 1,
    paid: order.isPaid,
    fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }));
  return (
    <ShopLayout
      title='Historial de ordenes'
      pageDescription='Historial de ordenes de clientes'
    >
      <Typography variant='h1' component='h1'>
        Historial de órdenes
      </Typography>
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            rowCount={10}
            pageSizeOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}) => {
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }

  return {
    props: {
      orders: await getOrdersByUser(session.user._id),
    },
  };
};

export default HistoryPage;
