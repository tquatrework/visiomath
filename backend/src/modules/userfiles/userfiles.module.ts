// userfiles.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UserFilesService } from './userfiles.service.js';
import { UserFilesController } from './userfiles.controller.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule} from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity.js';
import { UserFile } from '../../shared/entities/userfile.entity.js';

@Module({
  imports: [
    AuthModule,
    UsersModule, // Pour utiliser UsersService
    TypeOrmModule.forFeature([UserFile, User]),
    MulterModule.register({
      dest: './datafiles/vma_files',
    }),
  ], 
  controllers: [UserFilesController],
  providers: [UserFilesService],
  exports: [UserFilesService],
})
export class UserFilesModule {}