import { Test, TestingModule } from '@nestjs/testing';
import { ApiV1Controller } from './api-v1.controller';
import { ApiV1Service } from './api-v1.service';

describe('AppController', () => {
  let appController: ApiV1Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiV1Controller],
      providers: [ApiV1Service],
    }).compile();

    appController = app.get<ApiV1Controller>(ApiV1Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
