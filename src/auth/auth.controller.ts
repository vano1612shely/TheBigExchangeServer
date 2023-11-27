import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  BadRequestException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/loginDto";
import { Public } from "src/guards/decorators/public.decorator";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post("login")
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        throw new BadRequestException({
          message: "Incorrect data format",
          errors: errors,
        });
      },
    }),
  )
  login(@Body() userData: LoginDto) {
    return this.authService.login(userData);
  }
  @Post("create")
  create(@Body() userData: LoginDto) {
    return this.authService.createUser(userData.login, userData.password);
  }
}
