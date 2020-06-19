import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    UseGuards,
    Res,
    Put,
    Body,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
} from "@nestjs/swagger";
import User from "./user.entity";
import { UserService } from "./user.service";
import { RequestUser } from "../user/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateUserDTO } from "../user/dto/update-user.dto";

@ApiTags("Users")
@ApiExtraModels(User)
@ApiBearerAuth()
@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UserController {
    public constructor(private readonly userService: UserService) {}

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

    @Get("/image/:img")
    @ApiOperation({ summary: "Retourne l'image d'un tuilisateur" })
    public async userImage(@Param("img") image, @Res() res) {
        return res.sendFile(image, { root: "./src/public/img/" });
    }

    @Put()
    @ApiOperation({ summary: "Modifier un utilisateur" })
    @UseInterceptors(FileInterceptor("image"))
    public async update(
        @RequestUser() user: User,
        @Body() userData: UpdateUserDTO,
        @UploadedFile() file,
    ): Promise<any> {
        if (file) {
            userData.image = file.filename;
        }
        return await this.userService.update(user.id, userData);
    }

    @Put("add_wallet")
    @ApiOperation({ summary: "Ajouter de l'argent à un utilisateur" })
    @ApiBody({
        schema: {
            type: "number",
        },
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "The money can't be negative",
    })
    public async addToWallet(
        @RequestUser() user: User,
        @Body() money: any,
    ): Promise<any> {
        if (money.money <= 0) {
            throw new HttpException(
                "The money can't be negative",
                HttpStatus.FORBIDDEN,
            );
        }

        user.wallet += money.money;
        return await this.userService.wallet(user);
    }

    @Put("remove_wallet")
    @ApiOperation({ summary: "Retirer de l'argent à un utilisateur" })
    @ApiBody({
        schema: {
            type: "number",
        },
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "The money can't be negative",
    })
    public async removeFromWallet(
        @RequestUser() user: User,
        @Body() money: any,
    ): Promise<any> {
        if (money.money <= 0) {
            throw new HttpException(
                "The money can't be negative.",
                HttpStatus.FORBIDDEN,
            );
        }
        user.wallet -= money.money;
        return await this.userService.wallet(user);
    }
}
