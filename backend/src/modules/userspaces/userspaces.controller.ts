import { 
  Controller, Get, Post, Delete, Param, Query, Body, ParseIntPipe, UseGuards, Req, Request, Res, UnauthorizedException,
  NotFoundException, BadRequestException, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { UserSpacesService } from './userspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthRequest } from '../../shared/interfaces/auth-request';
import { CustomRequest } from '../../shared/interfaces/custom-request';
import { Response } from 'express';
import { UploadedFileType } from '../../shared/interfaces/uploaded-file-type';
import { UserFile } from '../../shared/entities/userfile.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('User Spaces')
@UseGuards(JwtAuthGuard)
@Controller('userspaces')
export class UserSpacesController {
  constructor(private readonly userSpacesService: UserSpacesService) {}

  /**
   * Retrieve user space by user ID.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve user space by user ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: false })  // Plus obligatoire
  @ApiResponse({ status: 200, description: 'User space retrieved successfully' })
  async getUserSpace(@Query('userId') userId?: string, @Req() req?: AuthRequest) {
      // Utilise l'ID du token si aucun userId n'est fourni
      const effectiveUserId = userId ? parseInt(userId) : req?.user?.id;

      if (!effectiveUserId || isNaN(effectiveUserId)) {
          throw new BadRequestException('Invalid or missing userId');
      }

      return this.userSpacesService.getUserSpace(effectiveUserId);
  }

  /**
   * Upload a new file for a user.
   */
  @Post('upload')
  @ApiOperation({ summary: 'Upload a new file for a user' })
  @ApiResponse({ status: 200, description: 'New user file uploaded successfully' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './datafiles/vma_files',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: UploadedFileType,
    @Request() req: CustomRequest
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userSpacesService.saveUserFile(userId, file.filename);
  }

  /**
   * Retrieve all files for a user.
   */
  @Get('files')
  @ApiOperation({ summary: 'Retrieve all files for a user' })
  @ApiResponse({ status: 200, description: 'User files retrieved successfully' })
  async getUserFiles(@Request() req: CustomRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userSpacesService.getFilesByUser(userId);
  }

  /**
   * Download a file by ID.
   */
  @Get('files/download/:fileId')
  @ApiOperation({ summary: 'Download a file by ID' })
  @ApiParam({ name: 'fileId', description: 'File ID', required: true })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response) {
    const file = await this.userSpacesService.findUserFileById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const filePath = file.path;
    return res.download(filePath);
  }

  /**
   * Delete a file by ID.
   */
  @Delete('files/:fileId')
  @ApiOperation({ summary: 'Delete a file by ID' })
  @ApiParam({ name: 'fileId', description: 'File ID', required: true })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('fileId') fileId: string, @Request() req: CustomRequest) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userSpacesService.deleteFile(userId, fileId);
  }
}
