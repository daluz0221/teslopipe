import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotalCost: number;
    tax: number;
    total: number;

    shippingaddress?: ShippingAddress;
}




const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotalCost: 0,
    tax: 0,
    total: 0,
    shippingaddress: undefined
}


export const CartProvider:FC = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer , CART_INITIAL_STATE );

    useEffect(() => {
     try {
         
         const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : []
         dispatch({type: '[Cart] - LoadCart from cookies | storage', payload:cookieProducts})
        } catch (error) {
         dispatch({type: '[Cart] - LoadCart from cookies | storage', payload:[]})
         
     }

    }, [])
    
    useEffect(() => {
      
        try {
         
            const cookieAddress = Cookie.get('userAddress') ? JSON.parse( Cookie.get('userAddress')! ) : {}
            dispatch({type: '[Cart] - Load address from cookies', payload:cookieAddress})
           } catch (error) {
            dispatch({type: '[Cart] - Load address from cookies', payload:{'firstName':'','lastName':'','address':'','address2':'','zip':'','city':'','country':'','phone':''}})
            
        }

    }, [])
    


    useEffect(() => {
      Cookie.set('cart', JSON.stringify(state.cart))
      
    }, [state.cart]);

    useEffect(() => {

        const numberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev,0);

        const subTotalCost = state.cart.reduce((prev, current) => (current.quantity * current.price) + prev,0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
      
        const orderSumary = {
            numberOfItems,
            subTotalCost,
            tax: subTotalCost * taxRate,
            total: subTotalCost * (taxRate + 1)
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSumary });
        
      
    }, [state.cart]);





    


    const addProductToCart = (poduct:ICartProduct) => {
        //Nuivel 1
        // dispatch({CartProducttype: '[Cart] - add Product', payload: poduct})

        //nivel 2
        // hubo nivel 2, pero tampoco era, yo solo hice nivel 1

        //Nivel 3
        const productInCart = state.cart.some( p => p._id === poduct._id );

        if (!productInCart) {
            return dispatch( { type: '[Cart] - add Product', payload: [...state.cart, poduct] })
        }

        const productInCartButDifferentSize = state.cart.some( p => p._id === poduct._id && p.size === poduct.size );
        if (!productInCartButDifferentSize) {
            return dispatch( { type: '[Cart] - add Product', payload: [...state.cart, poduct] })
        }


        //Acumular
        const updatedProducts = state.cart.map( p => {

            if (p._id !== poduct._id) {
                return p;
            }

            if (p.size !== poduct.size) {
                return p;
            }

            // Actualizar cantidad
            p.quantity += poduct.quantity;

            return p;

        });


        dispatch( { type: '[Cart] - add Product', payload: updatedProducts })
        
    }


    const updateCartQuantity = ( product:ICartProduct ) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product})
    }

    const removeCartProduct = ( product:ICartProduct ) => {
        dispatch({ type: '[Cart] - Remove product in cart', payload: product})
    }


    const updatedAddress = (address:ShippingAddress) => {
        
        const userAddress = {
            firstName:address.firstName,
            lastName:address.lastName,
            address:address.address,
            address2:address.address2,
            zip:address.zip,
            city:address.city,
            country:address.country,
            phone:address.phone,
        }

        Cookie.set("userAddress", JSON.stringify(address));
        dispatch({ type: '[Cart] - Update address ', payload: address});
    }


    const CreateOrder = async ():Promise<{ hasError:boolean; message: string; }> => {

        if (!state.shippingaddress){
            throw new Error('No hay dirección de envio');

        }

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size: p.size!,
                
            })),
            shippinAddress: state.shippingaddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotalCost,
            tax: state.tax,
            total: state.total,
            isPaid: false,
            paidAt: ''
        }
      
        try {
            
            const { data } = await tesloApi.post<IOrder>('/orders', body);

            dispatch({ type: '[Cart] - Order Complete' });

            return {
                hasError: false,
                message: data._id!
            }
            

        } catch (error) {
            if ( axios.isAxiosError(error) ){
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Error desconocido, hable con el administrador'
            }

        }

    }

    return (
        <CartContext.Provider value={{
            ...state,

            addProductToCart,
            removeCartProduct,
            updateCartQuantity,
            updatedAddress,


            //Orders
            CreateOrder
        }}>
            { children }
        </CartContext.Provider>
    )
};



// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
