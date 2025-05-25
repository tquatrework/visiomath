import { Routes } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module.js';
//import { UsersController } from './modules/users/users.controller';
import { AuthModule } from './modules/auth/auth.module.js';
//import { AuthController } from './modules/auth/auth.controller';
import { UserSpacesModule } from './modules/userspaces/userspaces.module.js';
//import { UserSpacesController } from './modules/userspaces/userspaces.controller';

export const routes: Routes = [
{
    path: 'auth',
    module: AuthModule,
    //controllers: [AuthController],
    },
  {
    path: 'users',
    module: UsersModule,
    //controllers: [UsersController],
  },
  {
    path: 'userspaces',
    module: UserSpacesModule,
    //controllers: [UserSpacesController],
  },
];