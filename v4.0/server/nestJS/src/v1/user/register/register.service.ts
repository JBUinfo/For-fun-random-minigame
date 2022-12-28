import { Injectable } from '@nestjs/common';
import { RegisterQueries } from './register.queries';
import { CommonUserQueries } from '../common-queries/common.queries';
import { Users } from 'src/entity/User.entity';
import { generateRandomValues } from 'src/utils/generate-random-pokemon.util';

@Injectable()
export class RegisterService {
  constructor(
    private readonly registerQueries: RegisterQueries,
    private readonly commonQueries: CommonUserQueries,
  ) {}
  async checkIfUserExists(nick: string): Promise<boolean> {
    const exists = await this.commonQueries.findByNick(nick);
    return !!exists;
  }

  async createNewUser({ nick, pass }): Promise<Users> {
    const exists = await this.registerQueries.createNewUser({ nick, pass });
    return exists;
  }
}
