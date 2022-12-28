import {
  HttpStatus,
  HttpException,
  Body,
  Controller,
  Get,
  Res,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { IResponse, TYPE_ERROR } from 'src/interfaces';
import { LoginService } from './login.service';
import { Users } from 'src/entity/User.entity';
import * as jwt from 'jsonwebtoken';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() body: Users, @Res() res: Response): Promise<void> {
    const { nick, pass } = body;
    if (!nick || !pass) {
      throw new HttpException(TYPE_ERROR.MISSING_INPUT, HttpStatus.BAD_REQUEST);
    }
    const userDB = await this.loginService.checkIfUserExists(nick); //Query
    const token = jwt.sign({ userDB }, process.env.SECRET_JWT);
    res.status(HttpStatus.OK).json(token);
  }
}
