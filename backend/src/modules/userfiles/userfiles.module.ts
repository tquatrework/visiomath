// userfiles.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UserFilesService } from './userfiles.service';
import { UserFilesController } from './userfiles.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule} from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { UserFile } from '../../shared/entities/userfile.entity';

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