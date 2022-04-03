import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary'


cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = | {
    message: string
}
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
                


        case 'PUT':
            return updateProducts(req, res);

        case 'POST':
            return createProduct(req, res)

    
        default:
            
            return res.status(400).json({ message: 'Bad request' })
    }




}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    await db.connect();

    const products = await Product.find()
    .sort({title:'asc'})
    .lean();


    await db.disconnect();

    //TODO: Tendremos que actualizar las imagenes
    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('https') ? image : `${process.env.
                HOST_NAME}products/${image}`
        })

        return product
    })

    res.status(200).json( updatedProducts ) 


}

async function updateProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
    

    const { _id = '', images = [] } = req.body as IProduct;

    if ( !isValidObjectId(_id)){
        return res.status(400).json({message: 'El id del producto no es válido'})
    }
    
    if ( images.length < 2){
        return res.status(400).json({message: 'Son necesarias mínimo 2(dos) imágenes'})
    }

    //TODO:
    //posiblemente tendremos un localhost:3000/products/asdasd.jpg

    try {

        await db.connect();

        const producto = await Product.findById(_id);
        if ( !producto){
            await db.disconnect();
            return res.status(400).json({message: 'No existe un producto con ese Id'})
        }
        
        //TODO: 
        //eliminar fotos en cloudinary(o donde se almacenen las imagenes en la nube)

        producto.images.forEach( async(image) => {
            if ( !images.includes(image)){
                //Borrar de cloudinary
                const [fileId, extension] = image.substring( image.lastIndexOf('/')+ 1 ).split('.');

                console.log({image, fileId, extension});

                await cloudinary.uploader.destroy(fileId);
                
            }
        })

        await producto.update( req.body );

        await db.disconnect();


        return res.status(200).json(producto)
        
    } catch (error) {
        console.log(error);
        
        await db.disconnect();
        return res.status(400).json({message: 'Revisar la consola del servidor'})

    }

}

async function createProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    const {images = []} = req.body as IProduct;
    
    if ( images.length < 2){
        return res.status(400).json({message: 'El producto necesita al menos 2 imágenes'});
        
    }
    
    
    //TODO:
    //posiblemente tendremos un localhost:3000/products/asdasd.jpg
    
    try {
        
        await db.connect();

        const productInDB = await Product.findOne({slug: req.body.slug});

        if (productInDB){
            await db.disconnect();
            return res.status(400).json({message: 'ya existe un producto con ese slug'});
        }

        const product = new Product( req.body );

        await product.save();


        await db.disconnect();

        return res.status(201).json(product);



    } catch (error) {
        await db.disconnect();
        return res.status(400).json({message: 'Revisar los logs del server'});
        console.log(error);
        
    }


}

