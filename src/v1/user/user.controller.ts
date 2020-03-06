import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: "Liste des utilisateurs." })
    public async index() {
        return await this.userService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Retourne l'utilisateur." })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "L'utilisateur n'existe pas.",
    })
    public async show(@Param("id") id: string) {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new HttpException(
                "L'utilisateur n'existe pas.",
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }
}
