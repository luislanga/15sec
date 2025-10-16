import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '15sec_core';

async function createPost() {
  await prisma.user.create({
    data: {
      email: 'lalilelulo@gmail.com',
      username: 'lalilelulo',
    },
  });
}

createPost();
