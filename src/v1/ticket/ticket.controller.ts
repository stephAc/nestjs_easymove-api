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
import User from "../user/user.entity";
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

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({
        summary:
            "Ajoute la liste des historiques passé en paramètre à l'utilisateur.",
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        schema: {
            items: {
                $ref: getSchemaPath(Ticket),
            },
        },
    })
    public async create(@RequestUser() user: User): Promise<Ticket> {
        return new Ticket();
    }
}
