import { Test, TestingModule } from '@nestjs/testing';
import { GiftsController } from '../user/gifts-user.controller';

describe('GiftsController', () => {
  let controller: GiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiftsController],
    }).compile();

    controller = module.get<GiftsController>(GiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
