import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    UseGuards,
    Res,
    Param,
    Post,
    ClassSerializerInterceptor,
    UseInterceptors,
    Delete,
    Put,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
    getSchemaPath,
    ApiParam,
} from "@nestjs/swagger";
import User, { UserRole } from "../user/user.entity";
import { RequestUser } from "../user/user.decorator";
import Ticket from "./ticket.entity";
import { TICKET_PRICE } from "./ticket.constant";
import { TicketService } from "./ticket.service";
import { UserService } from "../user/user.service";
import HistoryPay, {
    HistoryPayType,
} from "../historyPayment/historyPay.entity";
import { HistoryPayService } from "../historyPayment/historyPay.service";

@Controller("ticket")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Ticket")
@ApiBearerAuth()
export class TicketController {
    public constructor(
        private readonly ticketService: TicketService,
        private readonly userService: UserService,
        private readonly historyPayService: HistoryPayService,
    ) {}

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({
        summary: "Récupérer tous les tickets",
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Droit d'admin requis",
    })
    public async index(@RequestUser() user: User): Promise<Ticket[]> {
        if (user.role != UserRole.ADMIN) {
            throw new HttpException(
                "Droit d'admin requis",
                HttpStatus.UNAUTHORIZED,
            );
        }

        return await this.ticketService.index();
    }

    @Get("rate")
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({
        summary: "Récupérer le prix du ticket",
    })
    public async rate() {
        return TICKET_PRICE;
    }

    @Get("user")
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({
        summary: "Récupérer tous les tickets d'un utilisateur",
    })
    public async userTickets(@RequestUser() user: User): Promise<Ticket[]> {
        return await this.ticketService.ticketByUser(user);
    }

    @Get("buy")
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({
        summary: "Acheter un ticket",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        schema: {
            items: {
                $ref: getSchemaPath(Ticket),
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.PAYMENT_REQUIRED,
        description: "Les fonds de l'utilisateur ne sont pas suffisant",
    })
    public async create(@RequestUser() user: User): Promise<Object> {
        if (user.wallet - TICKET_PRICE < 0) {
            throw new HttpException(
                "Les fonds de l'utilisateur ne sont pas suffisant",
                HttpStatus.PAYMENT_REQUIRED,
            );
        }
        let ticket = new Ticket();
        ticket.rate = TICKET_PRICE;
        ticket.user = user;
        user.wallet -= TICKET_PRICE;

        this.userService.wallet(user);

        const newTicket = await this.ticketService.save(ticket);

        let historyPay = new HistoryPay();
        historyPay.price = "-" + TICKET_PRICE.toString();
        historyPay.user = user;
        historyPay.action = HistoryPayType.TICKET;
        await this.historyPayService.save(historyPay);

        delete user.password;

        return { "ticket": newTicket, user };
    }

    @Delete("refund/:ticketID")
    @ApiOperation({
        summary: "Se faire rembourser un ticket",
    })
    @ApiResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: "This ticket has already been used",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Wrong setting",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "This ticket doesn't belongs to this user",
    })
    @ApiParam({
        name: "ticketID",
        example: "fe7bb967-de22-44bf-b15f-5db184e9529c",
    })
    public async refund(
        @RequestUser() user: User,
        @Param("ticketID") ticketID,
    ): Promise<Object> {
        if (!ticketID) {
            throw new HttpException("Wrong setting", HttpStatus.BAD_REQUEST);
        }
        const ticket = await this.ticketService.findOneById(ticketID);
        if (!ticket) {
            throw new HttpException(
                "Ticket doesn't exist",
                HttpStatus.NOT_FOUND,
            );
        }
        if (!ticket.valid) {
            throw new HttpException(
                "This ticket has already been used",
                HttpStatus.NOT_ACCEPTABLE,
            );
        }
        if (ticket.user.id !== user.id) {
            throw new HttpException(
                "This ticket  doesn't belongs to this user",
                HttpStatus.BAD_REQUEST,
            );
        }
        user.wallet += ticket.rate;
        this.userService.wallet(user);
        let deletedTicket = await this.ticketService.delete(ticket);

        let historyPay = new HistoryPay();
        historyPay.price = ticket.rate.toString();
        historyPay.user = user;
        historyPay.action = HistoryPayType.REFUND;
        await this.historyPayService.save(historyPay);

        delete user.password;

        return { "ticket": deletedTicket, user };
    }

    @Put("use_ticket/:ticketID")
    @ApiOperation({
        summary: "Utiliser un ticket",
    })
    @ApiResponse({
        status: HttpStatus.NOT_ACCEPTABLE,
        description: "This ticket has already been used",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Wrong setting",
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "This ticket doesn't belongs to this user",
    })
    @ApiParam({
        name: "ticketID",
        example: "fe7bb967-de22-44bf-b15f-5db184e9529c",
    })
    public async useTicket(
        @RequestUser() user: User,
        @Param("ticketID") ticketID,
    ) {
        if (!ticketID) {
            throw new HttpException("Wrong setting", HttpStatus.BAD_REQUEST);
        }
        let ticket = await this.ticketService.findOneById(ticketID);
        console.log(ticket);
        if (!ticket) {
            throw new HttpException(
                "Ticket doesn't exist",
                HttpStatus.NOT_FOUND,
            );
        }
        if (!!ticket.valid) {
            throw new HttpException(
                "This ticket has already been used",
                HttpStatus.NOT_ACCEPTABLE,
            );
        }
        if (ticket.user.id !== user.id) {
            throw new HttpException(
                "This ticket  doesn't belongs to this user",
                HttpStatus.BAD_REQUEST,
            );
        }
        ticket.valid = "false";

        const updatedTicket = await this.ticketService.update(ticket);

        return { "ticket": updatedTicket };
    }
}
