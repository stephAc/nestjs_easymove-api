import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseArrayPipe,
    Post,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiBody,
    ApiExtraModels,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { RequestUser } from "../user/user.decorator";
import User from "../user/user.entity";
import HistoryPay from "./historyPay.entity";
import { HistoryPayService } from "./historyPay.service";

@Controller("historyPay")
@UseGuards(AuthGuard("jwt"))
@ApiTags("HistoryPay")
@ApiBearerAuth()
@ApiExtraModels(HistoryPay)
export class HistoryPayController {
    public constructor(private readonly historyPayService: HistoryPayService) {}

    @Get()
    @ApiOperation({
        summary: "Récupérer l'historique d'achat d'un utilisateur",
    })
    public async show(@RequestUser() user: User): Promise<HistoryPay[]> {
        return await this.historyPayService.index(user);
    }
}
