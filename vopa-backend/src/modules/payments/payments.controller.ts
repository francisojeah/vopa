import { Model } from 'mongoose';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { DetectionService } from './detections.service';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Post,
  Res,
  Param,
  Version,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DetectionResultProps } from './interfaces/detection.interfaces';

@ApiTags('detection')
@Controller('detection')
export class DetectionController {
  constructor(
    private detectionService: DetectionService,
    private configService: ConfigService,
  ) {}

  @Version('1')
  @Post('detect/:inputType')
  @UseInterceptors(FileInterceptor('file'))
  async detectDeepfake(
    @UploadedFile() file: Express.Multer.File,
    @Param('inputType') inputType: string,
    @Res() res: any,
  ): Promise<DetectionResultProps> {
    try {
      const detection = await this.detectionService.detectDeepfake(file, inputType);
      return res.status(HttpStatus.OK).json(detection);
    } catch (error) {
      const errorMessage =
        error.response?.message || error.message || 'Internal server error';
      const errorStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(errorStatus).json({ message: errorMessage });
    }
  }

  @Version('1')
  @Get('detection-history')
  async getDetectionHistory(@Res() res: any): Promise<DetectionResultProps[]> {
    try {
      const detectionHistory =
        await this.detectionService.getDetectionHistory();
      return res.status(HttpStatus.OK).json(detectionHistory);
    } catch (error) {
      const errorMessage =
        error.response?.message || error.message || 'Internal server error';
      const errorStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(errorStatus).json({ message: errorMessage });
    }
  }

  @Version('1')
  @Get('detection/:id')
  async getDetectionDetails(
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<DetectionResultProps> {
    try {
      const detection = await this.detectionService.getDetectionDetails(id);
      return res.status(HttpStatus.OK).json(detection);
    } catch (error) {
      const errorMessage =
        error.response?.message || error.message || 'Internal server error';
      const errorStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

      return res.status(errorStatus).json({ message: errorMessage });
    }
  }
}
