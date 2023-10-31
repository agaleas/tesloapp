import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { AdminLayout } from '@/components/layouts';
import { SummaryTile } from '@/components/admin';
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30 * 1000,
    }
  );

  const [refreshIn, setRefreshIn] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) return <></>;

  if (error) {
    return <Typography>Error al cargar la información</Typography>;
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithoutInventory,
    lowInventory,
  } = data!;
  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadisiticas generales'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle={'Ordenes totales'}
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subtitle={'Ordenes pagadas'}
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subtitle={'Ordenes pendientes'}
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfClients}
          subtitle={'Clientes'}
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={numberOfProducts}
          subtitle={'Productos'}
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={productsWithoutInventory}
          subtitle={'Productos sin existencia'}
          icon={
            <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTile
          title={lowInventory}
          subtitle={'Bajo Inventario'}
          icon={
            <ProductionQuantityLimitsOutlined
              color='warning'
              sx={{ fontSize: 40 }}
            />
          }
        />
        <SummaryTile
          title={refreshIn}
          subtitle={'Actualización en:'}
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
