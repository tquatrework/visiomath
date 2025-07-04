import { 
  Controller, Get, Post, Patch, Put, Delete, Param, Query, Body, UseInterceptors, UploadedFile, ParseIntPipe,
  UseGuards, Res, Request, NotFoundException, UnauthorizedException 
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileService } from './userprofiles.service';
import { UserProfile } from '../../shared/entities/userprofile.entity';
import { StudentProfile } from '../../shared/entities/studentProfile.entity';
import { StudentOrdonnance } from '../../shared/entities/studentOrdonnance.entity';
import { TeacherProfile } from '../../shared/entities/teacherProfile.entity';
import { TeacherOrdonnance } from '../../shared/entities/teacherOrdonnance.entity';
import { User } from '../../shared/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Logger } from '@nestjs/common';

@ApiTags('User Profiles')
@UseGuards(JwtAuthGuard)
@Controller('userprofiles')
export class UserProfileController {
  private readonly logger = new Logger(UserProfileController.name);

  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * Retrieve user profile by user ID.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve user profile by user ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async getUserProfile(@Query('userId') userId: string) {
    return this.userProfileService.getUserProfile(parseInt(userId));
  }

  /**
   * Retrieve full user profile with related data.
   */
  @Get('full')
  @ApiOperation({ summary: 'Retrieve full user profile with related data' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async getFullUserProfile(@Query('userId') userId: string) {
    return this.userProfileService.getFullUserProfile(parseInt(userId));
  }

  /**
   * Get avatar by filename.
   */
  @Get('avatar')
  @ApiOperation({ summary: 'Retrieve avatar by filename' })
  @ApiQuery({ name: 'filename', description: 'Avatar filename', required: true })
  async getAvatar(@Query('filename') filename: string, @Res() res: Response) {
    const filePath = path.resolve('./datafiles/vma_images', filename);
    return res.sendFile(filePath);
  }

  /**
   * Get avatar by user ID.
   */
  @Get('user/avatar')
  @ApiOperation({ summary: 'Retrieve avatar by user ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async getAvatarByUserId(@Query('userId') userId: string, @Res() res: Response) {
    const profile = await this.userProfileService.GetProfileByUserId(parseInt(userId));
    if (!profile || !profile.avatar) {
      throw new NotFoundException('Avatar not found');
    }
    const filePath = path.resolve('./datafiles/vma_images', profile.avatar.replace('/uploads/', ''));
    return res.sendFile(filePath);
  }

  /**
   * Create user profile.
   */
  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async createProfile(@Query('userId') userId: string, @Body() data: Partial<UserProfile>) {
    return this.userProfileService.createProfile(parseInt(userId), data);
  }

  /**
   * Upload avatar file.
   */
  @Put('upload-avatar')
  @ApiOperation({ summary: 'Upload avatar file' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 201, description: 'Avatar uploaded' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './datafiles/vma_images',
      filename: (req, file, callback) => {
        const userId = req.query.userId;
        const uniqueName = `${Date.now()}-user${userId}-${file.originalname}`;
        callback(null, uniqueName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error('Unsupported file type'), false);
      }
      callback(null, true);
    },
  }))
  async uploadPhoto(@Query('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    this.logger.log('File uploaded:', file);
    const avatarUrl = await this.userProfileService.uploadAvatar(parseInt(userId), file);
    return { message: 'Avatar uploaded successfully', avatarUrl };
  }

  /**
   * Update user profile.
   */
  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async updateUserProfile(@Query('userId') userId: string, @Body() data: { user: Omit<User, 'password' | 'toJSON'>; profile: UserProfile }) {
    return this.userProfileService.updateUserProfile(parseInt(userId), data);
  }

  /**
   * Update full user profile with related data.
   */
  @Patch('full')
  @ApiOperation({ summary: 'Update full user profile with related data' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async updateFullUserProfile(@Query('userId') userId: string, @Body() data: {
    user: Omit<User, 'password' | 'toJSON'>;
    profile: UserProfile;
    studentProfile?: StudentProfile;
    studentOrdonnance?: StudentOrdonnance;
    teacherProfile?: TeacherProfile;
    teacherOrdonnance?: TeacherOrdonnance;
  }) {
    return this.userProfileService.updateFullUserProfile(parseInt(userId), data);
  }

  /**
   * Delete user profile by user ID.
   */
  @Delete()
  @ApiOperation({ summary: 'Delete user profile by user ID' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiResponse({ status: 204, description: 'User profile deleted successfully.' })
  async deleteUserProfile(@Query('userId') userId: string): Promise<void> {
    await this.userProfileService.deleteUserProfile(parseInt(userId));
  }
}
