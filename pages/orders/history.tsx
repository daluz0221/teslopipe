import NextLink from 'next/link';

import { Chip, Grid, Link, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'

import { ShopLayout } from "../../components/layout"
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';


const columns:  GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 100
    },
    {
        field: 'fullname',
        headerName: 'Nombre Completo',
        width: 300
    },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si está pagada la orden o no',
        width: 200,
        renderCell: (params:GridValueGetterParams) => {
            return (
                params.row.paid
                ? <Chip color="success" label='Pagada' variant='outlined' />
                : <Chip color="error" label='No Pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'Ver',
        headerName: 'Ver orden',
        description: 'Ver la información detallada de la orden',
        width:100,
        sortable: false,
        renderCell: (params:GridValueGetterParams) => {
            return(
                <NextLink href={`/orders/${params.row.ver}`} passHref>
                    <Link underline='always'>
                        Ver Orden
                    </Link>
                </NextLink>
            )
        }
    }
]




interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({orders}) => {

    const rows = orders.map((order, index) => {
        return {
            id: index + 1,
            paid: order.isPaid,
            fullname: `${order.shippinAddress.firstName} ${order.shippinAddress.lastName}`,
            ver: order._id,
        }
    })
    
    
    

  return (
    <ShopLayout title={"Historial ordenes"} pageDescription={"Historial de las ordenes hechas por el cliente"}>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>


        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height:650, widows:'100%'}}>
                <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
        </Grid>

    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req}) => {
   

    const session:any = await getSession({req});

    if (!session){
        return {
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }


    const orders = await dbOrders.getOrdersByUser( session.user._id )


    return {
        props: {
            orders
        }
    }
}

export default HistoryPage