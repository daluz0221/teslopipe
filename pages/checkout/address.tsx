import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layout";
import { CartContext } from "../../context";
import { countries } from "../../utils";




type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}



const getAddressFromCookies = ():FormData => {
    
    

    const userAddress:FormData = JSON.parse(Cookies.get("userAddress") || "{}");

  return {
    // firstName:          Cookies.get('firstName') || '',
    // lastName:           Cookies.get('lastName') || '',
    // address:            Cookies.get('address') || '',
    // address2:           Cookies.get('address2') || '',
    // zip:                Cookies.get('zip') || '',
    // city:               Cookies.get('city') || '',
    // country:            Cookies.get('country') || '',
    // phone:              Cookies.get('phone') || '',
    firstName: userAddress ? userAddress.firstName : '',
    lastName: userAddress ? userAddress.lastName : '',
    address: userAddress ? userAddress.address : '',
    address2: userAddress ? userAddress.address2 : '',
    zip: userAddress ? userAddress.zip : '',
    city: userAddress ? userAddress.city : '',
    country: userAddress ? userAddress.country : '',
    phone: userAddress ? userAddress.phone : '',
  }
}


const AddressPage = () => {


    const router = useRouter();
    const { updatedAddress } = useContext(CartContext)

    const { register, handleSubmit,  formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    useEffect(() => {
      reset(getAddressFromCookies());
    }, [reset])
    

    const onAddressForm = (data:FormData) => {
    

        // Cookies.set('firstName', firstName);
        // Cookies.set('lastName', lastName);
        // Cookies.set('address', address);
        // Cookies.set('address2', address2 || '');
        // Cookies.set('zip', zip);
        // Cookies.set('city', city);
        // Cookies.set('country', country);
        // Cookies.set('phone', phone);



        updatedAddress(data);
        
        router.push("/checkout/summary");

    }


  return (
    <ShopLayout title={"Dirección"} pageDescription={"Confirmar dirección del destino"}>
        <Typography variant="h1" component='h1'>Dirección</Typography>
            <form onSubmit={handleSubmit(onAddressForm)}>
        <Grid container spacing={2} sx={{mt:2}}>
    
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('firstName', {
                        required: 'Este campo es requerido',
                        

                    }) }
                    error={!!errors.firstName ? true : false}
                    helperText={errors.firstName?.message}
                    label='Nombre' variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('lastName', {
                        required: 'Este campo es requerido',
                        

                    }) }
                    error={!!errors.lastName ? true : false}
                    helperText={errors.lastName?.message}
                    label='Apellido' variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('address', {
                        required: 'Este campo es requerido',
                        

                    }) }
                    error={!!errors.address ? true : false}
                    helperText={errors.address?.message}
                    label='Dirección' variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('address2') }
                   
                    label='Dirección 2 (opcional)' variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('zip', {
                        required: 'Este campo es requerido',
                        

                    }) }
                    error={!!errors.zip ? true : false}
                    helperText={errors.zip?.message}
                    label='Código Postal' variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('city', {
                        required: 'Este campo es requerido',
                        

                    }) }
                    error={!!errors.city ? true : false}
                    helperText={errors.city?.message}
                    label='Ciudad' variant="filled" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
    
                        <TextField
                            select
                            variant="filled"
                            label='País'
                            defaultValue={countries[0].code}
                            {...register('country', {
                                required: 'Este campo es requerido',
                                
        
                            }) }
                            error={!!errors.country ? true : false}
                            // helperText={errors.country?.message}
                        >
    
                            {
                                countries.map(country => (
                                    <MenuItem
                                    key={country.code}
                                    value={country.code}>{country.name}</MenuItem>
    
                                ))
                            }
    
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                    {...register('phone', {
                        required: 'Este campo es requerido',
                        

                    }) }
                    error={!!errors.phone ? true : false}
                    helperText={errors.phone?.message}
                    label='Teléfono' variant="filled" fullWidth />
                </Grid>
        </Grid>
        <Box sx={{mt:5}} display='flex' justifyContent='center'>
            <Button color='secondary' type="submit" className="circular-btn" size='large'>
                Revisar pedido
            </Button>
        </Box>
            </form>


    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


// export const getServerSideProps: GetServerSideProps = async ({req}) => {
    
//     const { token = '' } = req.cookies;
   
//     let isValidToken = false;

//     try {
//         await jwt.isValidadToken( token );
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }
//     return {
//         props: {
            
//         }
//     }
// }



export default AddressPage;