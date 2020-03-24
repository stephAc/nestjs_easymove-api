import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import History from "../history.entity";

export default class ListHistoryResponseDTO {
    @ApiProperty({ example: 1 })
    public totalPages: number;

    @ApiProperty({ example: 1 })
    public totalHistoryItems: number;

    @ApiProperty({ example: 1 })
    public page: number;

    @ApiProperty({
        type: "array",
        items: { $ref: getSchemaPath(History) },
    })
    public pageHistoryItems: History[];
}
