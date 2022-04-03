import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layout"
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context';
import { countries } from '../../utils/countries';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { ShippingAddress } from '../../interfaces';

const SummaryPage = () => {

    const { shippingaddress, numberOfItems, CreateOrder } = useContext(CartContext);
    const router = useRouter()

    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
      if ( !Cookies.get('userAddress') ){
        router.push('/checkout/address');
      }
    }, [router]);


    const onCreateOrder = async () => {
        setIsPosting(true);

        const { hasError, message } = await CreateOrder(); 

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`);
    }
    

    if (!shippingaddress) {
        return (
            <></>
        )
    }

    const { firstName, lastName, address,  zip, city, country, phone } = shippingaddress! as ShippingAddress;

    const countryName = countries.filter(c => c.code === country)[0].name;

  return (
    <ShopLayout title={"Resumen compra"} pageDescription={"Resumen de la orden del pedido"}>
        <Typography variant="h1" component='h1'>Resumen de tu pedido</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className="summary-card">
                    <CardContent>
                        <Typography variant="h2">Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})</Typography>
                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent='space-between'>
                        <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>
                        
                        <Typography >{`${firstName} ${lastName}`}</Typography>
                        <Typography >{`${address}`}</Typography>
                        <Typography >{`${city}, ${zip}`}</Typography>
                        <Typography >{`${countryName}`}</Typography>
                        <Typography >{`${phone}`}</Typography>
                        <Divider sx={{my:1}} />

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='always'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>


                        <OrderSummary />

                        <Box sx={{mt:3}} display='flex' flexDirection='column'>
                            <Button 
                            color="secondary" 
                            className='circular-btn' 
                            fullWidth
                            onClick={onCreateOrder}
                            disabled={isPosting}
                            >
                                Confirmar Orden
                            </Button>
                            <Chip
                                color='error'
                                label={errorMessage}
                                sx={{ display: errorMessage ? 'flex' : 'none', mt:2 }}
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;