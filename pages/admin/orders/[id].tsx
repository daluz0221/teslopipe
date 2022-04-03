
import { Box, Button, Card, CardContent, Chip,  Divider, Grid,  Typography } from "@mui/material"
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { CartList, OrderSummary } from "../../../components/cart"
import { ShopLayout } from "../../../components/layout"
import { GetServerSideProps, NextPage } from 'next';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces/order';
import { useState } from "react";


interface Props {
    order: IOrder
}




const OrderPage: NextPage<Props> = ({order}) => {


   

    const [isPaying, setIsPaying] = useState(false);

   
    


const { subTotal, tax, numberOfItems, total } = order;

const summaryPrice = {
    subTotalCost: subTotal,
    tax,
    total,
    numberOfItems
}

const { shippinAddress } = order;


  return (
    <ShopLayout title={"Resumen de la orden"} pageDescription={"Resumen de la orden del pedido"}>
        <Typography variant="h1" component='h1'>Orden: {order._id}</Typography>

    {
        order.isPaid
        ?(
            <Chip 
            sx={{my:2}}
            label='Pagada'
            variant='outlined'
            color='success'
            icon={<CreditScoreOutlined />}
        />
        )
        : (
            <Chip 
                sx={{my:2}}
                label='Pendiente de pago'
                variant='outlined'
                color='error'
                icon={<CreditCardOffOutlined />}
            />

        )
    }
        
        <Grid container className='fadeIn'>
            <Grid item xs={12} sm={7}>
                <CartList  products={ order.orderItems } />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className="summary-card">
                    <CardContent>
                        <Typography variant="h2">Resumen ({order.numberOfItems} { order.numberOfItems! > 1 ? 'productos' : 'producto'})</Typography>
                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent='space-between'>
                        <Typography variant='subtitle1'>Dirección de entrega</Typography>
                           
                        </Box>
                        
                        <Typography >{ shippinAddress.firstName } { shippinAddress.lastName }</Typography>
                        <Typography >{ shippinAddress.address } { shippinAddress.address2 ? `, ${ shippinAddress.address2 }`: '' }</Typography>
                        <Typography >{ shippinAddress.city }, { shippinAddress.zip }</Typography>
                        <Typography >{ shippinAddress.country }</Typography>
                        <Typography >{ shippinAddress.phone }</Typography>
                        <Divider sx={{my:1}} />

                      


                        <OrderSummary orderItems={summaryPrice} />

                        <Box sx={{mt:3}} display='flex' flexDirection='column'>
                            {/* TODO */}



                        

                            <Box sx={{ display: isPaying ? 'none' : 'flex', flex:1 }} flexDirection='column'>

                            {
                                order.isPaid
                                ? (

                                    <Chip 
                                        sx={{my:2}}
                                        label='Pagada'
                                        variant='outlined'
                                        color='success'
                                        icon={<CreditScoreOutlined />}
                                    />
                                ) :(

                                    <Chip 
                                    sx={{my:2}}
                                    label='Pendiente'
                                    variant='outlined'
                                    color='error'
                                    icon={<CreditScoreOutlined />}
                                />
                                )
                            }
                            </Box>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    

    

    const order = await dbOrders.getOrderByID( id.toString() )

    if (!order){
        return {
            redirect: {
                destination: `/admin/orders`,
                permanent: false
            }
        }
    }

    


    return {
        props: {
         order 
        }
    }
}

export default OrderPage;