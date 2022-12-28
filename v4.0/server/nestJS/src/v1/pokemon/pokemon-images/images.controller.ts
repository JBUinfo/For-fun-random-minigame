import {
  HttpStatus,
  HttpException,
  Body,
  Param,
  Controller,
  Get,
  Res,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { IResponse, TYPE_ERROR } from 'src/interfaces';
import { Users } from 'src/entity/User.entity';
import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';
import { existsSync } from 'fs';

@Controller()
export class ImagePokemonController {
  @Get()
  async login(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const path = resolve(
      `src/v1/pokemon/pokemon-images/images/imagesPokemon/${id}.png`,
    );
    if (!existsSync(path)) {
      res.status(HttpStatus.NOT_FOUND).send(TYPE_ERROR.IMAGE_NOT_FOUND);
    }
    res.status(HttpStatus.OK).sendFile(path, null, () => {});
  }
}
