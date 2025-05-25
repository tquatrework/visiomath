// userspace.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserSpacesService } from './userspaces.service.js';
import { UserSpacesController } from './userspaces.controller.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule} from '../auth/auth.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity.js';
import { UserFile } from '../../shared/entities/userfile.entity.js';

@Module({
  imports: [
    AuthModule,
    UsersModule, // Pour utiliser UsersService dans UserSpaceService
    TypeOrmModule.forFeature([UserFile, User]),
    MulterModule.register({
      dest: './datafiles/vma_files',
    }),
  ], 
  controllers: [UserSpacesController],
  providers: [UserSpacesService],
  exports: [UserSpacesService],
})
export class UserSpacesModule {}