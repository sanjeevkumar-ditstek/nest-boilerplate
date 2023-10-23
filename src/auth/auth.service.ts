import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import {
  comparePassword,
  hashPassword,
} from 'src/shared/helpers/password.helper';
import { RESPONSE_MESSAGES } from 'src/shared/constants/responseMessages.constant';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    //
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: RESPONSE_MESSAGES.USER.UserAlreadyExists,
        error: [RESPONSE_MESSAGES.USER.UserAlreadyExists],
      };
    }

    // Hash password
    const hash = await hashPassword(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.username);
    if (!user)
      return {
        status: HttpStatus.BAD_REQUEST,
        message: RESPONSE_MESSAGES.AUTH.InvalidCredentials,
        error: [RESPONSE_MESSAGES.AUTH.InvalidCredentials],
      };

    const passwordMatches = await comparePassword(data.password, user.password);
    if (!passwordMatches) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: RESPONSE_MESSAGES.AUTH.InvalidPassword,
        error: [RESPONSE_MESSAGES.AUTH.InvalidPassword],
      };
    }
    // throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
