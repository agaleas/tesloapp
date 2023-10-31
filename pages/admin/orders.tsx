import useSWR from 'swr';
import { Chip, Grid, Typography } from '@mui/material';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { AdminLayout } from '@/components/layouts';
import { IOrder, IUser } from '@/interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order Id', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre', width: 250 },
  { field: 'total', headerName: 'Monto Total', width: 200 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant='outlined' label='Pagada' color='success' />
      ) : (
        <Chip variant='outlined' label='No pagada' color='error' />
      );
    },
    width: 250,
  },
  {
    field: 'nroProducts',
    headerName: 'No. Productos',
    align: 'center',
    width: 150,
  },
  {
    field: 'check',
    headerName: 'Ver orden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target='_blank'>
          Ver orden
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Creada en', width: 300 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    nroProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title={'Ordenes'}
      subTitle={'Mantenimiento de Ordenes'}
      icon={<ConfirmationNumberOutlined />}
    >
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
    </AdminLayout>
  );
};

export default OrdersPage;
