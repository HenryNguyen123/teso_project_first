import { Test, TestingModule } from '@nestjs/testing';
import { adminAuthService } from './auth.service';

describe('adminAuthService', () => {
  let service: adminAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [adminAuthService],
    }).compile();

    service = module.get<adminAuthService>(adminAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
