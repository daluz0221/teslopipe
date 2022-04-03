import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces/order';
import { Product, Order } from '../../../models';

type Data = 
|{message: string}
|IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return createOrder( req, res );    
         
    
        default:
            return res.status(400).json({ message: 'Bad reque nene' })
            
    }

}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {


    const {orderItems, total} = req.body as IOrder;

    //Verificar que tengamos un usuario

    const session: any = await getSession({req});

    if (!session){
        return res.status(401).json({ message: 'Debes tar autenticado para realizar esta acción' });
    }

    // Crear un arreglo con los porductos que la persona quiere
    const productsIds = orderItems.map( (item: any) => item._id );
    await db.connect();

    const dbProducts = await Product.find({ _id: { $in: productsIds } });

   

    try {
        
        const subTotalCost = orderItems.reduce((prev, current) => {

            const currentPrice = dbProducts.find( (product: any) => product.id === current._id )?.price;

            if ( !currentPrice ){
                throw new Error('Verificar el carrito nuevamente, el producto no existe');
            }

            return (current.quantity * currentPrice) + prev
        },0);



        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const backendTotal = subTotalCost * ( taxRate + 1);

      
        
        
        if (total !== backendTotal){

            throw new Error('El total no coincide con el calculado');
        };

        //Todo bien hasta este punto

        const userId = session.user._id;

        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.total = Math.round(newOrder.total * 100) / 100;
        await newOrder.save();
        await db.disconnect();

        return res.status(201).json(newOrder);


        




    } catch (error:any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({ message: error.message || 'Error al crear el pedido' }); 
    }
    


    // return res.status(201).json(req.body)

}
