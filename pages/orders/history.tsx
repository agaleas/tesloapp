import { ShopLayout } from '@/components/layouts';
import { Chip, Grid, Typography, Link } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import NextLink from 'next/link';

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
        <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
          <Link underline='always' color='secondary'>
            {`Ver orden ${params.row.id}`}
          </Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: false, fullName: 'Allan Galeas', order: 123 },
  { id: 2, paid: true, fullName: 'Lidia Galeas', order: 124 },
  { id: 3, paid: false, fullName: 'Owen Galeas', order: 125 },
  { id: 4, paid: true, fullName: 'Raul Galeas', order: 122 },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title='Historial de ordenes'
      pageDescription='Historial de ordenes de clientes'
    >
      <Typography variant='h1' component='h1'>
        Historial de órdenes
      </Typography>
      <Grid container>
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

export default HistoryPage;
