import {  useEffect, useState } from 'react';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next'
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../../components/layout"
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { getProviders, getSession, signIn } from 'next-auth/react';


type FormData = {
    email: string,
    password: string,
  };



const LoginPage = () => {

    const router = useRouter();


    const { register, handleSubmit,  formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      
        getProviders().then( prov => {
            
            
            setProviders(prov);
        });

    }, [])
    
    
    

    const onLoginUser = async({email, password}: FormData) => {

        setShowError(false);

        // const isValidLogin =  await LoginUser(email, password);

        // if ( !isValidLogin ) {

        //     console.log(isValidLogin);
            
        //     setShowError(true);
            
        //     setTimeout(() => {
        //         setShowError(false);
        //     }, 3000);

        //     return;
        // }
        
    
        // const destination = router.query.p?.toString() || '/';

        
        // router.replace(destination)
      
        await signIn('credentials',{email, password});
        

    }

  return (
    <AuthLayout title={"Ingresar"}>
        <form onSubmit={ handleSubmit(onLoginUser)} noValidate>
            <Box sx={{width:350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar sesión</Typography>
                        <Chip 
                            label="Usuario o contraña incorrectos"
                            color="error"
                            icon={<ErrorOutline />}
                            className="fadeIn"
                            sx={{display: showError ? 'flex' : 'none'}}
                        />
                    </Grid>
            
            
                    <Grid item xs={12}>
                        <TextField
                        type='email'
                        label='Correo' variant="filled" fullWidth 
                        {...register('email', {
                            required: 'Este campo es requerido',
                            validate: validations.isEmail

                        }) }
                        error={!!errors.email ? true : false}
                        helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                        {...register('password',{
                            required: 'Este campo es requerido',
                            minLength: {value: 6, message: 'La contraseña debe tener al menos 6 caracteres'}
                        }) }
                        error={!!errors.password ? true : false}
                        helperText={errors.password?.message}
                        label='Contraseña' type='password' variant="filled" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                       <Button color='secondary' type='submit' className="circular-btn" size='large' fullWidth>
                           Ingresar
                       </Button>
                    </Grid>
                    <Grid item xs={12}>
                       <NextLink href={ router.query.p ?  `/auth/register?p=${router.query.p?.toString() || '/'}` : '/auth/register'} passHref>
                            <Link underline='always'>
                                ¿No tienes cuenta?
                            </Link>
                       </NextLink>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{width: '100%', mb:2}} />

                        {
                            Object.values( providers ).map( (provider: any) => {

                                if (provider.id === 'credentials') return (<div key='credentials'></div>)

                                return (
                                    <Button key={provider.id} sx={{ mb:1 }} variant='outlined' color='primary' fullWidth onClick={() => {
                                        signIn( provider.id );
                                    }}>
                                        {provider.name}
                                    </Button>
                                )
                            })
                        }
                        

                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
   
    const session = await getSession({req});
    const { p = '/' } = query;

    if (session) {

        return {
            redirect:{
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default LoginPage