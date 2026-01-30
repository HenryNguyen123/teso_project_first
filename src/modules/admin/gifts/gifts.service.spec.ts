import { Test, TestingModule } from '@nestjs/testing';
import { AdminGiftsService } from './gifts.service';

describe('GiftsService', () => {
  let service: AdminGiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminGiftsService],
    }).compile();

    service = module.get<AdminGiftsService>(AdminGiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
