import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/loginDto";
import { DatabaseService } from "src/database/database.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}
  async login(userData: LoginDto) {
    try {
      const candidate = await this.databaseService.user.findFirst({
        where: { login: userData.login },
      });
      if (!candidate) {
        throw new UnauthorizedException(
          "Користувача з таким іменем не знайдено",
        );
      }
      const checkPass = await bcrypt.compare(
        userData.password,
        candidate.password,
      );
      if (!checkPass) {
        throw new UnauthorizedException("Пароль не вірний");
      }
      const payload = {
        sub: candidate.id,
        login: candidate.login,
      };
      return {
        user: payload,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async createUser(login, password) {
    const pass = await bcrypt.hash(password, 12);
    const res = await this.databaseService.user.create({
      data: { login, password: pass },
    });
    return res;
  }
  getUserIdFromToken(token: string): number | null {
    try {
      const payload = this.jwtService.verify(token);
      if ("sub" in payload) {
        return payload.sub;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
