import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../components/layout';
import ProductList from '../components/products/ProductList';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';





const Home: NextPage = () => {

 

  

 const { products, isLoading }  = useProducts('products')
  


  return (
    <ShopLayout title={'Teslo-Shop-Home'} pageDescription={'Aquí lo mejor para tí'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb:1 }}>Todos los productos</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products } />
      }

      

    </ShopLayout>
  )
}

export default Home;
