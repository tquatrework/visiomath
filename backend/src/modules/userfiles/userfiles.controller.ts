import { 
  Controller, Get, Post, Patch, Delete, Param, Query, Body, UseInterceptors, UploadedFile, ParseIntPipe,
  UseGuards, Req, Request, Res, UnauthorizedException, 
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CustomRequest } from '../../shared/interfaces/custom-request.js';
import { UserFilesService } from './userfiles.service.js';
import { UserFile } from '../../shared/entities/userfile.entity.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadedFileType } from '../../shared/interfaces/uploaded-file-type.js';
import * as path from 'path';

@ApiTags('User Files')
@UseGuards(JwtAuthGuard)
@Controller('userfiles')
export class UserFilesController {
  constructor(private readonly userfilesService: UserFilesService) {}

  /**
   * Retrieve all files for a user.
   */
  @Get('files')
  @ApiOperation({ summary: 'Retrieve all files for a user' })
  @ApiQuery({ name: 'userId', description: 'ID of the user', required: false })
  @ApiResponse({ status: 200, description: 'List of files retrieved successfully.', type: [UserFile] })
  async getUserFiles(@Query('userId') userId?: string): Promise<UserFile[]> {
    return userId 
      ? this.userfilesService.getFilesByUser(parseInt(userId)) 
      : this.userfilesService.findAll();
  }

  /**
   * Download a file by its ID.
   */
  @Get('files/download')
  @ApiOperation({ summary: 'Download a file by its ID' })
  @ApiQuery({ name: 'fileId', description: 'ID of the file to download', required: true })
  @ApiResponse({ status: 200, description: 'File downloaded successfully.' })
  async downloadFile(@Query('fileId') fileId: string, @Res() res: Response) {
    const file = await this.userfilesService.findUserFileById(parseInt(fileId));
    if (!file) {
      throw new UnauthorizedException('Userfile not found');
    }

    const filePath = file.path;
    const finalName = path.basename(file.path);
    const cleanedName = encodeURIComponent(finalName.substring(14));

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.header('Content-Disposition', `attachment; filename="${cleanedName}"`);
    return res.download(filePath, cleanedName);
  }

  /**
   * Upload a new user file.
   */
  @Post('upload')
  @ApiOperation({ summary: 'Upload a new user file' })
  @ApiQuery({ name: 'userId', description: 'ID of the user', required: true })
  @ApiBody({
    description: 'Metadata for the file being uploaded',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'File to upload' },
        category: { type: 'string', example: 'documents', description: 'Category of the file' },
        subcategory: { type: 'string', example: 'invoices', description: 'Subcategory of the file' },
        comment: { type: 'string', example: 'Invoice for June 2024', description: 'Optional comment for the file' },
      },
    },
  })
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
    @Query('userId') userId: string,
    @UploadedFile() file: UploadedFileType,
    @Body() body: { category?: string; subcategory?: string; comment?: string }
  ): Promise<UserFile> {
    return this.userfilesService.saveUserFile(parseInt(userId), file.filename, body.category || '', body.subcategory || '', body.comment || '');
  }

  /**
   * Update metadata for a user file by ID.
   */
  @Patch('files')
  @ApiOperation({ summary: 'Update file metadata' })
  @ApiQuery({ name: 'fileId', description: 'ID of the file to update', required: true })
  @ApiBody({
    description: 'Metadata to update for the file',
    schema: {
      type: 'object',
      properties: {
        category: { type: 'string', example: 'updated-category' },
        subcategory: { type: 'string', example: 'updated-subcategory' },
        comment: { type: 'string', example: 'Updated comment for the file' },
      },
    },
  })
  async updateFile(
    @Query('fileId') fileId: string,
    @Body() updateData: { category?: string; subcategory?: string; comment?: string },
  ): Promise<UserFile> {
    return this.userfilesService.updateFileMetadata(parseInt(fileId), updateData);
  }

  /**
   * Delete a user file by ID.
   */
  @Delete('files')
  @ApiOperation({ summary: 'Delete a user file by ID' })
  @ApiQuery({ name: 'fileId', description: 'ID of the file to delete', required: true })
  async deleteFile(@Query('fileId') fileId: string): Promise<void> {
    await this.userfilesService.deleteFile(parseInt(fileId));
  }
}
