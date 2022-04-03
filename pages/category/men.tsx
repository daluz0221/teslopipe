import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layout';
import ProductList from '../../components/products/ProductList';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MenPage = () => {
  
 const { products, isLoading }  = useProducts('products?gender=men')
  
    
    

 return (
   <ShopLayout title={'Teslo-Shop-Men'} pageDescription={'Aquí lo mejor para tí'}>
     <Typography variant='h1' component='h1'>Tienda</Typography>
     <Typography variant='h2' sx={{ mb:1 }}>Productos para hombre</Typography>

     {
       isLoading
       ? <FullScreenLoading />
       : <ProductList products={ products } />
     }

     

   </ShopLayout>
 )
}

export default MenPage;