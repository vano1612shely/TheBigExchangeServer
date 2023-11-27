import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "src/database/database.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config/dist";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/guards/auth.guard";
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: new ConfigService().get("jwtSecret"),
      signOptions: { expiresIn: "30d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
