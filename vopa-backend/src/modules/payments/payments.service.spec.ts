import { Test, TestingModule } from '@nestjs/testing';
import { DetectionService } from './detections.service';

describe('DetectionService', () => {
  let service: DetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetectionService],
    }).compile();

    service = module.get<DetectionService>(DetectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
