import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    UseGuards,
    Res,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
} from "@nestjs/swagger";
import User from "../user/user.entity";
import { RequestUser } from "../user/user.decorator";
import Navigo from "./navigo.entity";
import { NavigoService } from "./navigo.service";
import { UserService } from "../user/user.service";
import { SUBSCRIPTION } from "./navigo.constant";
import { NavigoFlatRate } from "../navigo/navigo.entity";
import HistoryPay, {
    HistoryPayType,
} from "../historyPayment/historyPay.entity";
import { HistoryPayService } from "../historyPayment/historyPay.service";
@Controller("navigo")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Navigo")
@ApiBearerAuth()
export class NavigoController {
    public constructor(
        private readonly navigoService: NavigoService,
        private readonly userService: UserService,
        private readonly historyPayService: HistoryPayService,
    ) {}

    @ApiOperation({
        summary: "Récupérer les prix des abonnements",
    })
    @Get()
    public async rate(): Promise<Object> {
        return SUBSCRIPTION;
    }
    @ApiOperation({
        summary: "Prendre un abonnement",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "This flat rate does not exist",
    })
    @ApiResponse({
        status: HttpStatus.PAYMENT_REQUIRED,
        description: "Les fonds de l'utilisateur ne sont pas suffisant",
    })
    @ApiParam({
        name: "flatRate",
        type: "enum",
        required: true,
        example: NavigoFlatRate,
    })
    @Get(":flatRate")
    public async subscribe(
        @RequestUser() user: User,
        @Param("flatRate") flatRate: string,
    ): Promise<Object> {
        console.log("flatrate ", flatRate);
        if (!(flatRate in NavigoFlatRate)) {
            throw new HttpException(
                "This flat rate does not exist",
                HttpStatus.BAD_REQUEST,
            );
        }

        if (user.wallet < SUBSCRIPTION[flatRate]) {
            throw new HttpException(
                "Les fonds de l'utilisateur ne sont pas suffisant",
                HttpStatus.PAYMENT_REQUIRED,
            );
        }

        let navigo = new Navigo();
        navigo.price = SUBSCRIPTION[flatRate];
        navigo.flatRate = NavigoFlatRate[flatRate];
        navigo.startedOn = new Date();

        switch (flatRate) {
            case NavigoFlatRate.WEEK:
                navigo.finishOn = new Date();
                navigo.finishOn.setDate(navigo.finishOn.getDate() + 7);
                break;
            case NavigoFlatRate.MONTH:
                navigo.finishOn = new Date();
                navigo.finishOn.setMonth(navigo.finishOn.getMonth() + 1);
                break;
            case NavigoFlatRate.YEAR:
                navigo.finishOn = new Date();
                navigo.finishOn.setFullYear(navigo.finishOn.getFullYear() + 1);
                break;
        }
        const savedNav = await this.navigoService.create(navigo);

        user.wallet -= SUBSCRIPTION[flatRate];
        user.navigo = savedNav;
        console.log(user);
        const updatedUser = await this.userService.updateNavigo(user);

        let historyPay = new HistoryPay();
        historyPay.price = "-" + SUBSCRIPTION[flatRate];
        historyPay.user = user;
        historyPay.action = HistoryPayType.PASS;
        await this.historyPayService.save(historyPay);

        return {
            data: { updatedUser, navigo },
            message: "User new wallet and navigo",
        };
    }
}
