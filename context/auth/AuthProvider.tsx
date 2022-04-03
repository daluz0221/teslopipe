import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, useEffect, useReducer } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}


export const AuthProvider:FC = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer , AUTH_INITIAL_STATE );
    const router = useRouter()

    const { data, status } = useSession();

    useEffect(() => {

        if(status === 'authenticated'){
            
            
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
        }
    }, [data, status])


    // useEffect(() => {
    //     checkToken();
    // }, [])
    
    const checkToken = async () => {

        if (!Cookies.get('token')) {
            return;
        }
        try {
            const { data } = await tesloApi.get('/user/validate');
            const { token, user } = data;

            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload:  user  });
            return true
        } catch (error) {
            Cookies.remove('token');
        }
        
    }


    const LoginUser = async (email:string, password:string): Promise<boolean> => {
      try {
          
        const { data } = await tesloApi.post('/user/login', { email, password });
        const { token, user } = data;

        Cookies.set('token', token );

        
        

        dispatch({ type: '[Auth] - Login', payload:  user  });
        return true

      } catch (error) {
          console.log(error);
          
          return false
      }
    }

    const registerUser = async (name:string, email:string, password:string ): Promise<{hasError: boolean; message?: string}> => {
      try {
          
        const { data } = await tesloApi.post('/user/register', { name, email, password });
        const { token, user } = data;

        Cookies.set('token', token );

        
        

        dispatch({ type: '[Auth] - Login', payload:  user  });
        
        return {
            hasError: false
        }

      } catch (error) {
          
        if(axios.isAxiosError(error)){
            return {
                hasError: true,
                message: error.response?.data.message
            }
        }

        return {
            hasError: true,
            message: 'Ocurrió un error al registrar el usuario'
        }
      }
    }

    const onLogout = () => {
        Cookies.remove('token');
        Cookies.remove('cart');
        Cookies.remove('userAddress');
        // router.reload();
        signOut();
    }


    return (
        <AuthContext.Provider value={{
            ...state,


            //Methods
            LoginUser,
            registerUser,
            onLogout
        }}>
            { children }
        </AuthContext.Provider>
    )
};