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
} from "@nestjs/swagger";
import User, { UserRole } from "../user/user.entity";
import { RequestUser } from "../user/user.decorator";
import Ticket from "./ticket.entity";
import { TICKET_PRICE } from "./ticket.constant";
import { TicketService } from "./ticket.service";

@Controller("ticket")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Ticket")
@ApiBearerAuth()
export class TicketController {
    public constructor(private readonly ticketService: TicketService) {}

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
    public async create(@RequestUser() user: User): Promise<Ticket> {
        if (user.wallet - TICKET_PRICE < 0) {
            throw new HttpException(
                "Les fonds de l'utilisateur ne sont pas suffisant",
                HttpStatus.PAYMENT_REQUIRED,
            );
        }
        const ticket = new Ticket();
        ticket.user = user;

        return await this.ticketService.save(ticket);
    }
}
