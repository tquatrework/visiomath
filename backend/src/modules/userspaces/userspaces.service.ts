import { Injectable, forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFile } from '../../shared/entities/userfile.entity';
import { User } from '../../shared/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UploadedFileType } from '../../shared/interfaces/uploaded-file-type';
import * as fs from 'fs';

@Injectable()
export class UserSpacesService {
  constructor(
    @InjectRepository(UserFile)
    private readonly userFileRepository: Repository<UserFile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * Retrieve user space by user ID.
   */
  async getUserSpace(userId: number) {
      const userSpace = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['userFiles'], // Associer les fichiers
      });

      if (!userSpace) {
          throw new NotFoundException('User space not found');
      }

      return userSpace;
  }

  /**
   * Save a new file for a user.
   */
  async saveUserFile(userId: number, filename: string): Promise<UserFile> {
    const filePath = `./datafiles/vma_files/${filename}`;
    const userFile = this.userFileRepository.create({
      name: filename,
      path: filePath,
      user: { id: userId },
    });
    return await this.userFileRepository.save(userFile);
  }

  /**
   * Retrieve all files for a user.
   */
  async getFilesByUser(userId: number): Promise<UserFile[]> {
    return this.userFileRepository.find({
      where: { user: { id: userId } },
    });
  }

  /**
   * Find a file by ID.
   */
  async findUserFileById(fileId: number): Promise<UserFile | null> {
    return await this.userFileRepository.findOneBy({ id: fileId });
  }

  /**
   * Delete a file by ID for a user.
   */
  async deleteFile(userId: number, fileId: string): Promise<{ message: string }> {
    const file = await this.userFileRepository.findOne({
      where: { id: parseInt(fileId, 10), user: { id: userId } },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      } else {
        console.warn(`Le fichier ${file.path} n'existe pas dans le système de fichiers.`);
      }

      await this.userFileRepository.remove(file);
      return { message: 'File deleted successfully' };
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier :', error);
      throw new Error('Impossible de supprimer le fichier');
    }
  }
}
