import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './db';

export const NEXT_AUTH_CONFIG = {
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: 'email', type: 'text', placeholder: 'Enter your email' },
            password: { label: 'password', type: 'password', placeholder: 'Enter your password' },
            name: { label: 'name', type: 'text', placeholder: 'Enter your name' },
          },

          async authorize(credentials: any) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: credentials.email,
                }
            });

            if(existingUser){
                const passwordValidate = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidate) {
                    return {
                        id: existingUser.id,
                        email: existingUser.email,
                    }
                }
                return null;
            }
            
            try {
                const newUser = await prisma.user.create({
                    data: {
                        email: credentials.email,
                        password: hashedPassword,
                        name: credentials.name,
                    }
                });

                return {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                }
            } catch (error) {
                console.log(error);
            }
            return null;
          },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
        if (user) {
            token.uid = user.id;
        }
        return token;
        },
        session: ({ session, token, user }: any) => {
          if (session.user) {
              session.user.id = token.uid
          }
          return session
      }
    },
    pages: {
        signIn: '/signin',
        signUp:'/signup'
    }
  }