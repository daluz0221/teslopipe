import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces';


interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotalCost: number;
    tax: number;
    total: number;

    shippingaddress?: ShippingAddress,

    //Methods

    addProductToCart: (poduct: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updatedAddress: (address: ShippingAddress) => void;


    //Orders
    CreateOrder: () => Promise<{ hasError:boolean; message: string; }>;
}


export const CartContext = createContext({} as ContextProps );