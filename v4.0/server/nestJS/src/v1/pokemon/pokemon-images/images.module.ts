import { Module } from '@nestjs/common';
import { ImagePokemonController } from './images.controller';

@Module({
  controllers: [ImagePokemonController],
})
export class ImagePokemonModule {}
