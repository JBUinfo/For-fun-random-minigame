import { Routes } from '@nestjs/core';
import { API_V1_ROUTES } from './v1/api-v1.routes';
import { ApiV1Module } from './v1/api-v1.module';

export const APP_ROUTES: Routes = [
  {
    path: 'v1',
    module: ApiV1Module,
    children: API_V1_ROUTES,
  },
];
