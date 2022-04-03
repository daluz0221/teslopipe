import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../../components/layout"
import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';
import { getSession, signIn } from 'next-auth/react';


type FormData = {
    name: string,
    email: string,
    password: string,
}


const RegisterPage = () => {


    const router = useRouter();
    const { registerUser } = useContext(AuthContext)

    const { register, handleSubmit,  formState: { errors } } = useForm<FormData>();

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    
    const destination = router.query.p?.toString() || '/';

    const onRegisterUser = async({name, email, password}: FormData) => {

        setShowError(false);

        const resp = await registerUser(name, email, password);

        if ( resp.hasError ) {
            setShowError(true);
            setErrorMessage(resp.message!);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }
    
        
        
        // router.replace(destination);

        await signIn('credentials',{email, password});
    
    }


  return (
    <AuthLayout title={"Ingresar"}>
        <form onSubmit={ handleSubmit(onRegisterUser)} noValidate>
            <Box sx={{width:350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Registrarse</Typography>
                        <Chip 
                            label="Email ya registrado"
                            color="error"
                            icon={<ErrorOutline />}
                            className="fadeIn"
                            sx={{display: showError ? 'flex' : 'none'}}
                        />
                    </Grid>
            
            
                    <Grid item xs={12}>
                        <TextField 
                        {...register('name',{
                            required: 'Este campo es requerido',
                            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                        })}
                        error={!!errors.name ? true : false}
                        helperText={errors.name?.message}
                        label='Nombre' variant="filled" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                        {...register('email', {
                            required: 'Este campo es requerido',
                            validate: validations.isEmail

                        }) }
                        error={!!errors.email ? true : false}
                        helperText={errors.email?.message}
                        label='Correo' variant="filled" fullWidth type='email' />
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
                           Registrar
                       </Button>
                    </Grid>
                    <Grid item xs={12}>
                       <NextLink 
                       href={router.query.p ? `/auth/login${destination}` : '/auth/login'} 
                       passHref>
                            <Link underline='always'>
                                Ya tengo una cuenta
                            </Link>
                       </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

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

export default RegisterPage