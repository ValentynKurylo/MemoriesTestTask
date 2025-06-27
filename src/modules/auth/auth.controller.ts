import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dtos';
import { Request } from 'express';
import { AuthResponseInterface } from '../../common/interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login and receive access & refresh tokens' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Tokens returned on successful login',
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseInterface> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'New access and refresh tokens',
    type: LoginResponseDto,
  })
  async refresh(@Req() req: Request): Promise<AuthResponseInterface> {
    const authHeader = req.headers.authorization;
    return this.authService.refresh(authHeader);
  }
}
