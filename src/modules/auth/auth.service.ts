import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../schemas';
import { LoginDto } from './dtos';
import {
  AuthResponseInterface,
  MinimalUserInterface,
} from '../../common/interfaces';
import { getTokenFromHeaderHelper } from '../../common/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseInterface> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.generateTokens(user as MinimalUserInterface);
  }

  async refresh(authToken: string): Promise<AuthResponseInterface> {
    const token = getTokenFromHeaderHelper(authToken);

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return this.generateTokens({
      _id: payload.sub,
      role: payload.role,
    } as MinimalUserInterface);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async generateTokens(
    user: MinimalUserInterface,
  ): Promise<AuthResponseInterface> {
    const payload = { sub: user._id.toString(), role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRE_IN,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
    });

    return { accessToken, refreshToken };
  }
}
