import * as dotenv from 'dotenv';
dotenv.config();
import { db } from '15sec_core/dist/index';

async function createPost() {
  await db.user.create({
    data: {
      username: 'testUser',
    },
  });
}

createPost();
