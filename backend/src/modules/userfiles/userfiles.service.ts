import { Injectable, forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFile } from '../../shared/entities/userfile.entity.js';
import { User } from '../../shared/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import * as fs from 'fs';

@Injectable()
export class UserFilesService {
  constructor(
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * Save a new user file.
   */
  async saveUserFile(userId: number, filename: string, category: string, subcategory: string, comment: string): Promise<UserFile> {
    const filePath = `./datafiles/vma_files/${filename}`;

    const userFile = this.userFileRepository.create({
      name: filename,
      path: filePath,
      category,
      subcategory,
      comment,
      user: { id: userId },
    });

    return await this.userFileRepository.save(userFile);
  }

  /**
   * Retrieve all files or files for a specific user.
   */
  async findAll(userId?: number): Promise<UserFile[]> {
    if (userId) {
      return this.userFileRepository.find({
        where: { user: { id: userId } },
      });
    }
    return this.userFileRepository.find();
  }

  /**
   * Retrieve files by user ID.
   */
  async getFilesByUser(userId: number): Promise<UserFile[]> {
    return this.userFileRepository.find({
      where: { user: { id: userId } },
    });
  }

  /**
   * Find a user file by its ID.
   */
  async findUserFileById(fileId: number): Promise<UserFile> {
    const file = await this.userFileRepository.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  /**
   * Delete a user file by ID and user ID.
   */
  async deleteFile(fileId: number): Promise<void> {
    const file = await this.userFileRepository.findOne({ where: { id: fileId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      await this.userFileRepository.remove(file);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Update metadata for a user file by ID.
   */
  async updateFileMetadata(fileId: number, updateData: { category?: string; subcategory?: string; comment?: string }): Promise<UserFile> {
    const file = await this.findUserFileById(fileId);

    if (updateData.category) file.category = updateData.category;
    if (updateData.subcategory) file.subcategory = updateData.subcategory;
    if (updateData.comment) file.comment = updateData.comment;

    return this.userFileRepository.save(file);
  }
}

