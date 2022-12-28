import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './images.controller';
import { LoginService } from './images.service';

describe('AppController', () => {
  let appController: LoginController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [LoginService],
    }).compile();

    appController = app.get<LoginController>(LoginController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
