import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layout";



const ErrorPage = () => {
  return (
    <ShopLayout title={"Page not found"} pageDescription={"No hemos podido encontrar nada que coincida con tu busqueda"}>
        <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)' sx={{flexDirection: {xs: "column", sm: "row"}}}>
            <Typography variant="h1" component='h1' fontSize={70} fontWeight={200}>404 |</Typography>
            <Typography marginLeft={2}>No hemos podido encontrar nada que coincida con tu busqueda</Typography>
        </Box>
    </ShopLayout>
  )
}

export default ErrorPage;