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
import CreateHistoryDTO from "./dto/create-history.dto";
import ListHistoryDTO from "./dto/list-history-request.dto";
import ListHistoryResponseDTO from "./dto/list-history-response.dto";
import { HISTORY_ITEMS_PER_PAGE } from "./history.constant";
import History, { HistoryFilter } from "./history.entity";
import { HistoryService } from "./history.service";

@Controller("history")
@UseGuards(AuthGuard("jwt"))
@ApiTags("History")
@ApiBearerAuth()
@ApiExtraModels(
    History,
    CreateHistoryDTO,
    ListHistoryDTO,
    ListHistoryResponseDTO,
)
export class HistoryController {
    public constructor(private readonly historyService: HistoryService) {}

    @Get(":filter/:page")
    @ApiOperation({
        summary: `Liste l'historique de l'utilisateur avec pagination (${HISTORY_ITEMS_PER_PAGE} éléments par page).`,
    })
    @ApiParam({
        name: "filter",
        type: "enum",
        enum: HistoryFilter,
        required: true,
        example: HistoryFilter.DAILY,
    })
    @ApiParam({ name: "page", type: "number", required: true, example: "1" })
    @ApiResponse({ status: HttpStatus.OK, type: () => ListHistoryResponseDTO })
    public async index(
        @RequestUser() { id }: User,
        @Param() { filter, page }: ListHistoryDTO,
    ): Promise<ListHistoryResponseDTO> {
        const [
            pageHistoryItems,
            totalHistoryItems,
        ] = await this.historyService.getPerPage(id, filter, page);

        const totalPages = Math.ceil(
            totalHistoryItems / HISTORY_ITEMS_PER_PAGE,
        );

        return {
            totalPages,
            totalHistoryItems,
            page,
            pageHistoryItems,
        };
    }

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiOperation({
        summary:
            "Ajoute la liste des historiques passé en paramètre à l'utilisateur.",
    })
    @ApiBody({
        schema: {
            type: "array",
            items: {
                $ref: getSchemaPath(CreateHistoryDTO),
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        schema: {
            type: "array",
            items: {
                $ref: getSchemaPath(History),
            },
        },
    })
    public async create(
        @RequestUser() user: User,
        @Body(new ParseArrayPipe({ items: CreateHistoryDTO }))
        historyList: CreateHistoryDTO[],
    ): Promise<History[]> {
        const newHistoryList = historyList
            .map(history => plainToClass(History, history))
            .map(history => {
                history.user = user;
                return history;
            });

        return await this.historyService.save(newHistoryList);
    }
}
