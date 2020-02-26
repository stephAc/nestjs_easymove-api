import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("users")
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
    public async show(@Param("id") id: number) {
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
