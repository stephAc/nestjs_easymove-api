import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../user/dto/create_user.dto";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("Authentification")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: "Connecter un utilisateur, retourne son ID" })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Identifiants incorrects",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Utilisateur connecté",
        schema: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjEwN2QxLWU5OTQtNDI4ZC05MWQ4LTIwYzE3MjM4NjVlYiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU4MzUwNjg5OSwiZXhwIjoxNTgzNTUwMDk5fQ.ghsxkWklzCKjzIHVG1Etung3yHfw6TRb_jng8UBhz3c",
                },
            },
        },
    })
    async login(@Body() loginDto: LoginDto): Promise<{ token: String }> {
        return { token: await this.authService.validateUser(loginDto) };
    }

    @Post("register")
    @ApiOperation({ summary: "Créer un utilisateur" })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Données invalides",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "L'utilisateur a été ajouté",
    })
    // Using CreateUserDto will automatically launch validation pipeline
    async register(@Body() createUserDto: CreateUserDto) {
        const { email, username, password } = createUserDto;

        // Check if email is already used
        if (await this.userService.findOneByEmail(email)) {
            throw new HttpException(
                "Cette adresse email est déjà utilisée",
                HttpStatus.BAD_REQUEST,
            );
        }

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = bcrypt.hashSync(password, 10);
        await this.userService.save(user);
        return { message: "L'utilisateur a été ajouté" };
    }
}
