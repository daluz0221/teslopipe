import NextLink from 'next/link'

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import { ItemCounter } from '../ui'
import { FC, useContext } from 'react'
import { CartContext } from '../../context'
import { ICartProduct, IOrderItem } from '../../interfaces'





interface Props {
  editable?: boolean;
  products?: IOrderItem[]
}

export const CartList:FC<Props> = ({editable=false, products}) => {

  const {cart:productsInCart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  

  const onUpdateCartQuantity = (product: ICartProduct, newQuantityValue:number) =>{
   
    product.quantity = newQuantityValue;

    updateCartQuantity( product );
   
  }


  const removeCartProductFrom = ( product: ICartProduct ) => {

    removeCartProduct(product);
  }
  console.log(productsInCart);
  

  const productsToShow = products ? products : productsInCart;
  

  return (
    <>
    {
        productsToShow.map((product, index) => (
           <Grid container spacing={2} sx={{mb:1}} key={product.slug + index}>
              <Grid item xs={3}>
                {/* Llevar a la página dl producto */}
                <NextLink href={`/products/${product.slug}`} passHref>
                  <Link>
                    <CardActionArea>
                      <CardMedia 
                        image={product.image }
                        component='img'
                        sx={{borderRadius: '5px'}}
                      />
                    </CardActionArea>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item xs={7}>
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>{product.title}</Typography>
                  <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                 
                  {
                    editable 
                    ? <ItemCounter 
                      currentValue={product.quantity}
                      updatedQuantity={( value ) => onUpdateCartQuantity( product as ICartProduct, value )}
                      maxValue={15}
                    />
                    : <Typography variant='h6'>{product.quantity} producto{product.quantity > 1 ? 's': ''}</Typography>
                    
                  }
                </Box>
              </Grid>
              <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                <Typography variant='subtitle1'>{`$${ product.price }`}</Typography>
            
                {
                  editable && (

                    <Button variant='text' color='secondary' onClick={ () => removeCartProductFrom(product as ICartProduct)}>
                      Remover
                    </Button>
                  )
                  
                }
              </Grid>
           </Grid>
        ))
    }
    
    </>
  )
}
