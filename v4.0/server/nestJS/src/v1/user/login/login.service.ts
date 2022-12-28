import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { CommonUserQueries } from '../common-queries/common.queries';
import { Users } from 'src/entity/User.entity';

@Injectable()
export class LoginService {
  constructor(private readonly commonQueries: CommonUserQueries) {}
  async checkIfUserExists(nick: string): Promise<Users> {
    const exists = await this.commonQueries.findByNick(nick);
    return exists;
  }
}
