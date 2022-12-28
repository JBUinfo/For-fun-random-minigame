import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { Users } from 'src/entity/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonUserQueries } from '../common-queries/common.queries';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [LoginController],
  providers: [LoginService, CommonUserQueries],
})
export class LoginModule {}
