import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {
    
    isLoggedIn: boolean;
    user?: IUser;


    //Methods   
    LoginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string }>;
    onLogout: () => void;
    
}


export const AuthContext = createContext({} as ContextProps );