import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "login should not be empty" })
  @IsString()
  login: string;
  @IsNotEmpty({ message: "password should not be empty" })
  @IsString()
  password: string;
}
