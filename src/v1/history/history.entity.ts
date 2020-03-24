import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../user/user.entity";

export enum HistoryFilter {
    DAILY = "daily",
    MONTHLY = "monthly",
    ANNUAL = "annual",
}

@Entity({ name: "history" })
export default class History {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: "1" })
    id: number;

    @Column()
    @ApiProperty({ examples: ["Navigo", "1.80"], example: "1.80" })
    price: string;

    @Column({ name: "departure_station" })
    @ApiProperty({ example: "Gare Montparnasse" })
    departureStation: string;

    // Use Colum insted of CreatedDateColumn to be able to pass createdAt default value during tests
    @Column({ name: "created_at", default: () => "NOW()" })
    @ApiProperty({ example: "2020-01-01T11:11:00.111Z" })
    createdAt: Date;

    @ManyToOne(type => User, { nullable: false, onDelete: "CASCADE" })
    @Transform(user => user.id)
    @ApiProperty({
        name: "userId",
        type: "string",
        example: "fe7bb967-de22-44bf-b15f-5db184e9529c",
    })
    user: User;
}
