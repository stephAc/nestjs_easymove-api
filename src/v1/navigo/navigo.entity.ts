import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum NavigoFlatRate {
    WEEK = "week",
    MONTHLY = "monthly",
    ANNUAL = "annual",
    NONE = "none",
}

@Entity({ name: "navigo" })
export default class Navigo {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ example: "fe7bb967- de22 - 44bf - b15f - 5db184e9529c" })
    id: number;

    @Column({
        type: "enum",
        enum: NavigoFlatRate,
        default: NavigoFlatRate.NONE,
    })
    @ApiProperty({
        enum: NavigoFlatRate,
        examples: [
            NavigoFlatRate.ANNUAL,
            NavigoFlatRate.MONTHLY,
            NavigoFlatRate.ANNUAL,
            NavigoFlatRate.NONE,
        ],
    })
    flatRate: NavigoFlatRate;

    @Column()
    @ApiProperty({ examples: ["Navigo", "1.80"], example: "1.80" })
    price: string;

    // Use Colum insted of CreatedDateColumn to be able to pass createdAt default value during tests
    @Column({ name: "startedOn", default: () => "NOW()" })
    @ApiProperty({ example: "2020-01-01T11:11:00.111Z" })
    startedOn: Date;

    @Column({ name: "finishOn", default: () => "NOW()" })
    @ApiProperty({ example: "2020-01-01T11:11:00.111Z" })
    finishOn: Date;
}
