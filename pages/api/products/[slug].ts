import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models'

type Data = 
| { message: string }
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch(req.method){
        case 'GET':
            return getSlugProduct( req, res )
        
            default:
                return res.status(400).json({message: 'Bad request'})
    }

    
}

const getSlugProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {slug} = req.query;

    
    
    

    // if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
    //     condition = { gender };
    // }
    
    
    await db.connect();

    const product = await Product.findOne({slug}).lean()

    await db.disconnect();

    if (!product){
        return res.status(404).json({message: 'objeto no encontrado'})
    }

    product.images = product.images.map( image => {
        return image.includes('https') ? image : `${process.env.
            HOST_NAME}products/${image}`
    })

    return res.status(200).json( product )

}
