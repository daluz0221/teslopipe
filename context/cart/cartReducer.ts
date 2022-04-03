import { ICartProduct, ShippingAddress } from '../../interfaces';
import { CartState } from './';


type CartActionType = 
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] } 
   | { type: '[Cart] - add Product', payload: ICartProduct[] } 
   | { type: '[Cart] - Change cart quantity', payload: ICartProduct } 
   | { type: '[Cart] - Remove product in cart', payload: ICartProduct } 
   | { type: '[Cart] - Load address from cookies', payload: ShippingAddress } 
   | { type: '[Cart] - Update address ', payload: ShippingAddress } 
   | { 
      type: '[Cart] - Update order summary', 
      payload: {
         numberOfItems: number;
         subTotalCost: number;
         tax: number;
         total: number;
      } 
   } 
   | {type: '[Cart] - Order Complete'}

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

   switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
         return {
            ...state,
            isLoaded: true,
            cart: [...action.payload]
          }

      case '[Cart] - Update address ':
      case '[Cart] - Load address from cookies':
         return {
            ...state,
            shippingaddress: action.payload

         }

      case '[Cart] - add Product':
         return {
            ...state,
             cart: [...action.payload]
         }
      
      case '[Cart] - Change cart quantity':
         return {
            ...state,
            cart : state.cart.map( product => {
               if (product._id !== action.payload._id) {
                  return product;
               }
               if (product.size !== action.payload.size) {
                  return product;
               }

               return action.payload


            })
         }

      case '[Cart] - Remove product in cart':
         return {
            ...state,
            cart :  state.cart.filter( product => {
              if (product._id === action.payload._id){
                 return product.size !== action.payload.size
              } 
              return product;
            })
         }

      case '[Cart] - Update order summary':
         return {
            ...state,
            ...action.payload
         }

      case '[Cart] - Order Complete':
         return {
            ...state,
            cart: [],
            numberOfItems: 0,
            subTotalCost: 0,
            tax: 0,
            total: 0,

         }

       default:
          return state;
   }

}