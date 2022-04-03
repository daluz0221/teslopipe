import { createContext } from 'react';


interface ContextProps {
    isMenuOpen: boolean;

    //Métodos
    toggleSideMenu: () => void;
}


export const UiContext = createContext({} as ContextProps );