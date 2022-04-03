import { AttachMoney, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { SummayTile } from '../../components/admin';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {


  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
    refreshInterval: 30 * 1000,
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(()=>{
      console.log('Tick');
      setRefreshIn(refreshIn => refreshIn> 0? refreshIn - 1 : 30);
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  if ( !error && !data ){
    return <></>
  }

  if (error){
    console.log(error);
    return <Typography>Error al cargar la información, ver la consola</Typography>
    
  }


  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoinventory,
    lowInventory
  } = data!;
  
  return (
    <AdminLayout
      title='Dashboard'
      subtitle='Estadísticas generales'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>

        <SummayTile
          title={ numberOfOrders }
          subtitle="Ordenes totales"
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ paidOrders }
          subtitle="Ordenes pagadas"
          icon={<AttachMoney color='success' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ notPaidOrders }
          subtitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ numberOfClients }
          subtitle="Clientes"
          icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ numberOfProducts }
          subtitle="Productos"
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ productsWithNoinventory }
          subtitle="Productos sin exstencas"
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ lowInventory }
          subtitle="Productos con pocas existencias"
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/>}
        />

        <SummayTile
          title={ refreshIn }
          subtitle="Actualización en:"
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/>}
        />

      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage