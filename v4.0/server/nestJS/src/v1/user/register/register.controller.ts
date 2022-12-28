import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Body } from '@nestjs/common/decorators';
import { RegisterService } from './register.service';
import { Users } from 'src/entity/User.entity';
import { TYPE_ERROR } from 'src/interfaces';

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}
  @Post()
  async register(@Body() body: Users, @Res() res: Response): Promise<void> {
    const { nick, pass } = body;
    if (!nick || !pass) {
      throw new HttpException(TYPE_ERROR.MISSING_INPUT, HttpStatus.BAD_REQUEST);
    }

    const checkUser = await this.registerService.checkIfUserExists(nick); //Query

    if (checkUser) {
      throw new HttpException(TYPE_ERROR.USER_EXISTS, HttpStatus.BAD_REQUEST);
    }

    try {
      const userDB = await this.registerService.createNewUser({ nick, pass });
      if (!userDB.id) {
        throw Error('Error');
      }
      const token = jwt.sign({ userDB }, process.env.SECRET_JWT);
      res.status(HttpStatus.OK).json(token);
    } catch (e) {
      throw new HttpException(
        TYPE_ERROR.USER_EXISTS,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
