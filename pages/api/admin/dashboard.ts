import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number;
    notPaidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNoinventory: number;
    lowInventory: number;
}


export default async function handler  (req: NextApiRequest, res: NextApiResponse<Data>) {
    

    await db.connect();

    // const numberOfOrders = await Order.find().count();
    // const numberOfProducts = await Product.find().count();

    // const paidOrders = await Order.find({isPaid: true}).count();
    // const notPaidOrders = await Order.find({isPaid: false}).count();
    // const numberOfClients = await User.find({role:'client'}).count();
    // const productsWithNoinventory = await Product.find({inStock: 0}).count();
    // const lowInventory = await Product.find({inStock: {$lte: 10}}).count();

    const [
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoinventory,
        lowInventory
    ] = await Promise.all([
        Order.find().count(),
        Order.find({isPaid: true}).count(),
        Order.find({isPaid: false}).count(),
        User.find({role:'client'}).count(),
        Product.find().count(),
        Product.find({inStock: 0}).count(),
        Product.find({inStock: {$lte: 10}}).count(),
    ])
    
    
    await db.disconnect();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoinventory,
        lowInventory
     })



}