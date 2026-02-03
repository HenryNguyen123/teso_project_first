import { Test, TestingModule } from '@nestjs/testing';
import { AdminGiftsController } from './gifts-admin.controller';

describe('GiftsController', () => {
  let controller: AdminGiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminGiftsController],
    }).compile();

    controller = module.get<AdminGiftsController>(AdminGiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
