import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    
    // ...add more providers here

    Credentials({
        name: 'Custom Login',
        credentials: {
            email: { lable: 'Correo', type: 'email', placeholder: 'Correo@google.com' },
            password: { label: 'Contraseña', type: 'password', placeholder: 'Tu contraseña' },
        },
        async authorize(credentials) {

           
            

            // return {name: 'Juan', email: 'juanchito@google.com', role: 'admin'};

            return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
        }
    }),
    GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),

  ],

  //Custom pages

  pages:{
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  jwt:{},

  session: {
      maxAge: 2592000,
      strategy: 'jwt',
      updateAge: 86400
  },

  //Callbacks
  callbacks: {
      async jwt({token, account, user}){
        //   console.log(token, account, user);
        if (account){
            token.accessToken = account.access_token;

            switch (account.type) {
                case 'credentials':
                    token.user = user;
                    break;
                case 'oauth':
                    //TODO: crear usuario o verificar si existe
                    token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
                    break;
            
                ;
            }
        }

        return token;
      },
      async session({ session, token, user }){
        //   console.log(session, token, user);

        session.accessToken = token.accessToken;
        session.user = token.user as any;

        return session;
      }
  }


});