// auth.controller.ts
import { Controller, Post,  Get, UseGuards, Request, Req, Res, Body, Query, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from '../../shared/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unable to logout properly' })
  async logout(@Req() req : Request, @Res() res : Response) {
    const token = (req.headers as Record<string, any>)['authorization']?.split(' ')[1];
    if (!token) {
    }

    await this.authService.invalidateToken(token);

    return res.status(HttpStatus.OK).json({
      message: 'Logged out successfully',
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  getProfile(@Request() req: Request) {
    //return req.user;
    return req.body; 
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('check-username')
  @ApiOperation({ summary: 'Verify username existence' })
  @ApiResponse({ status: 200, description: 'Verification done successfully' })
  async getUserNameChecked(
    @Query('username') pseudo: string,  // type de relation à filtrer
      ) {
    return this.authService.getUserNameChecked(pseudo).then(checked => {
      if (!checked) {
        return { success: false };  // Renvoie un objet avec success: false
      }
    return { success: true };  // Renvoie un objet avec success: true
    });
  }
}
