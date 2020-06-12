import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import {
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "../user/dto/create-user.dto";
import User from "../user/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginRequestDTO } from "./dto/login-request.dto";
import { LoginResponseDTO } from "./dto/login-response.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Authentification")
@ApiExtraModels(LoginResponseDTO)
@Controller("auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: "Connecte un utilisateur" })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "Identifiants incorrects.",
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "Utilisateur connecté.",
        type: () => LoginResponseDTO,
    })
    async login(@Body() loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
        // TODO: remove password via serialization
        return await this.authService.validateUser(loginDto);
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
    @UseInterceptors(FileInterceptor("image"))
    // Using CreateUserDTO will automatically launch validation pipeline
    async register(@Body() createUserDTO: CreateUserDTO, @UploadedFile() file) {
        const { email, username, password } = createUserDTO;
        let response = {};

        // Check if email is already used
        // TODO: extract to class-validator custom validation
        if (await this.userService.findOneByEmail(email)) {
            throw new HttpException(
                "Cette adresse email est déjà utilisée",
                HttpStatus.BAD_REQUEST,
            );
        }
        if (file) {
            console.log(file);
        }

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = bcrypt.hashSync(password, 10);
        if (file) {
            user.image = file.filename;
        }
        let savedUser = await this.userService.save(user);
        delete savedUser["password"];

        return { message: "L'utilisateur a été ajouté", response, savedUser };
    }
}
