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
    Delete,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
    ApiParam,
} from "@nestjs/swagger";
import User from "./user.entity";
import { UserService } from "./user.service";
import { RequestUser } from "../user/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateUserDTO } from "../user/dto/update-user.dto";
import HistoryPay, {
    HistoryPayType,
} from "../historyPayment/historyPay.entity";
import { HistoryPayService } from "../historyPayment/historyPay.service";

@ApiTags("Users")
@ApiExtraModels(User)
@ApiBearerAuth()
@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UserController {
    public constructor(
        private readonly userService: UserService,
        private readonly historyPayService: HistoryPayService,
    ) {}

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

        let historyPay = new HistoryPay();
        historyPay.price = money.money;
        historyPay.user = user;
        historyPay.action = HistoryPayType.DEPOSIT;

        user.wallet += parseInt(money.money, 10);
        const updatedUser = await this.userService.wallet(user);
        await this.historyPayService.save(historyPay);
        return updatedUser;
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

        let historyPay = new HistoryPay();
        historyPay.price = "-" + money.money;
        historyPay.user = user;
        historyPay.action = HistoryPayType.WITHDRAW;

        user.wallet -= money.money;
        const updatedUser = await this.userService.wallet(user);
        await this.historyPayService.save(historyPay);

        return updatedUser;
    }
    @Delete(":userID")
    @ApiOperation({ summary: "Supprimer un utilisateur" })
    @ApiParam({
        name: "UserID",
        example: "fe7bb967-de22-44bf-b15f-5db184e9529c",
    })
    public async delete(@Param("userID") userID): Promise<Object> {
        return await this.userService.delete(userID);
    }
}
