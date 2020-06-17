import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class UpdateUserDTO {
    @IsOptional()
    @IsEmail()
    @IsString()
    @ApiProperty({ example: "test@test.com" })
    email: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: "Test" })
    username: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: "password" })
    password: string;

    @IsOptional()
    @ApiProperty({ example: "Ajouter un fichier" })
    image: string;
}
