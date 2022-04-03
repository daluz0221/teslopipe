import bcrypt from 'bcryptjs';
import { db } from "."
import { User } from "../models";



export const checkUserEmailPassword = async(email:string, password:string) => {

    await db.connect();

    const user = await User.findOne({email});

    await db.disconnect();

    if (!user) return null;

    if ( !bcrypt.compareSync(password, user.password!) ) return null;

    const { role, name, _id } = user;

    return {
        _id,
        email: email.toLowerCase(),
        role,
        name
    }



}

// Esta funcion crea o verifica el usuario Oauth
export const oAuthToDbUser = async(oAuthEmail:string, oAuthName:string) => {

    await db.connect();
    const user = await User.findOne({email: oAuthEmail});

    if (user) {
        await db.disconnect();
        const { role, name, _id, email } = user;
        return { _id, email, role, name };
    }

    const newUser = new User({

        email: oAuthEmail,
        name: oAuthName,
        password: '@',
        role: 'client'
    });

    await newUser.save();
    await db.disconnect();

    const { _id, email, name, role } = newUser;

}