import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, Min } from "class-validator";
import { HistoryFilter } from "../history.entity";

export default class ListHistoryRequestDTO {
    @IsEnum(HistoryFilter)
    @ApiProperty({ enum: HistoryFilter })
    public filter: HistoryFilter;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Transform(id => parseInt(id))
    @ApiProperty()
    public page: number;
}
