import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user: {
      userId: string;
      email: string;
    };
  }
}