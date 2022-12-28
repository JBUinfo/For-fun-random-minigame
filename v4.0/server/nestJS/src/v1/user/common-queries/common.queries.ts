import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../../entity/User.entity';

@Injectable()
export class CommonUserQueries {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findByNick(nick: string): Promise<Users> {
    const result = await this.userRepository.findOneBy({ nick });
    return result;
  }
}
