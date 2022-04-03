import { Grid, Typography } from "@mui/material"
import { FC, useContext } from "react"
import { CartContext } from "../../context/cart/CartContext"
import { currency } from "../../utils";
import { NextPage } from 'next';


interface Props {
    orderItems?: {
        subTotalCost: number;
        tax: number;
        total: number;
        numberOfItems: number | undefined;
    }
}

export const OrderSummary:FC<Props> = ({orderItems}) => {


    const { numberOfItems, subTotalCost, total, tax } = useContext(CartContext);

    const valuesSummary = orderItems ? orderItems : { numberOfItems, subTotalCost, total, tax };

   
    
    

    
    

  return (
    <Grid container>
        
        
         
            <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{valuesSummary.numberOfItems} item{valuesSummary.numberOfItems! > 1 ? 's':''}</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{currency.format( valuesSummary.subTotalCost )}</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Impuestos({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{currency.format(valuesSummary.tax)}</Typography>
        </Grid>

        <Grid item xs={6} sx={{mt:2}}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt:2}} display='flex' justifyContent='end'>
            <Typography variant="subtitle1">{currency.format(valuesSummary.total)}</Typography>
        </Grid>
       

    </Grid>
  )
}
