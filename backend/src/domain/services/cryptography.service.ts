import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
const bcrypt = bcryptjs;

@Injectable()
export class CryptographyService {
  async hash(plainText: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(plainText, saltRounds);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
