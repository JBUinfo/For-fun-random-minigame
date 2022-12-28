import { ImagePokemonModule } from './pokemon/pokemon-images/images.module';
import { LoginModule } from './user/login/login.module';
import { RegisterModule } from './user/register/register.module';

export const API_V1_ROUTES = [
  {
    path: 'login',
    module: LoginModule,
  },
  {
    path: 'register',
    module: RegisterModule,
  },
  {
    path: 'images/:id',
    module: ImagePokemonModule,
  },
];
