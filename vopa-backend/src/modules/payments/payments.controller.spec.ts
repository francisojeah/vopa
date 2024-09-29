import { Test, TestingModule } from '@nestjs/testing';
import { DetectionController } from './detections.controller';
import { DetectionService } from './detections.service';

describe('DetectionsController', () => {
  let controller: DetectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetectionController],
      providers: [DetectionService],
    }).compile();

    controller = module.get<DetectionController>(DetectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
