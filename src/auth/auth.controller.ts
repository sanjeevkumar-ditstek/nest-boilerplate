import { AuthService } from "./auth.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthGuard } from "./auth.guard";
import { Body, Controller, Get, Post, Req, Request } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
interface IRequest extends Request {
  user: any;
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post("login")
  signn(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Get("logout")
  logout(@Req() req: IRequest) {
    this.authService.logout(req.user["sub"]);
  }
}
