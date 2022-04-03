import { Typography } from '@mui/material';
import { NextPage } from 'next';
import React from 'react'
import { ShopLayout } from '../../components/layout';
import ProductList from '../../components/products/ProductList';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidPage:NextPage = () => {
  
 const { products, isLoading }  = useProducts('products?gender=kid')
  


 return (
   <ShopLayout title={'Teslo-Shop-Kids'} pageDescription={'Aquí lo mejor para tí'}>
     <Typography variant='h1' component='h1'>Tienda</Typography>
     <Typography variant='h2' sx={{ mb:1 }}>Productos de niños</Typography>

     {
       isLoading
       ? <FullScreenLoading />
       : <ProductList products={ products } />
     }

     

   </ShopLayout>
 )
}

export default KidPage;