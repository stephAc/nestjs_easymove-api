import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @ApiProperty({ example: "test@test.com" })
    readonly email: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "password" })
    readonly password: string;
}
