import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export default class CreateHistoryDTO {
    @IsString()
    @ApiProperty({ examples: ["Navigo", "1.80"] })
    public price: string;

    @IsString()
    @MinLength(4)
    @ApiProperty({ example: "Gare Montparnasse" })
    public departureStation: string;
}
