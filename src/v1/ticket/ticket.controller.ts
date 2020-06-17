import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    UseGuards,
    Res,
    Param,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import User from "../user/user.entity";
import Ticket from "./ticket.entity";
import { TICKET_PRICE } from "./ticket.constant";
import { TicketService } from "./ticket.service";

@Controller("ticket")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Ticket")
@ApiBearerAuth()
export class TicketController {
    public constructor(private readonly ticketService: TicketService) {}
}
