import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { User } from '../../../models'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data = 
| { message: string }
| { 
    token: string;
    user:{
        name:   string;
        email:  string;
        role:   string;
    }
 }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'POST':
            
            return registerUser(req, res)
    
        default:
            return res.status(400).json({ message: 'Bad request nene' })
    }

   
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    const  { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    

    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }
    
    if (name.length < 3) {
        return res.status(400).json({ message: 'El nombre debe ser de mínimo 2 caracteres' })
    }

    if ( !validations.isValidEmail( email )) {
        return res.status(400).json({ message: 'El email no es válido' })
    }

    await db.connect();

    const user = await User.findOne({email});

    if (user) {
        return res.status(400).json({ message: 'El correo ya está registrado' })
    }


    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password, 10),
        name,
        role: 'client'
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: 'Revisar logs en el server' })
    }
        
  


   

    const {  _id } = newUser;

    const token = jwt.singToken(_id, email);

    return res.status(200).json({
        token,
        user: {
            email, role: 'client', name
        }
    })

}
