import { AuthService } from './auth.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthGuard } from './auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
interface IRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  private authService;
  constructor(service: AuthService) {
    this.authService = service;
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Get('logout')
  logout(@Req() req: IRequest) {
    this.authService.logout(req.user['sub']);
  }
}
