import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../user/user.entity";
import { TICKET_PRICE } from "./ticket.constant";
@Entity({ name: "tickets" })
export default class Ticket {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ example: "fe7bb967-de22-44bf-b15f-5db184e9529c" })
    id: string;

    @Column({
        type: "float",
        name: "rate",
        default: TICKET_PRICE,
        nullable: false,
    })
    @ApiProperty({ examples: ["Metro", "1.80"], example: "1.80" })
    rate: number;

    // Use Colum insted of CreatedDateColumn to be able to pass createdAt default value during tests
    @Column({ name: "created_at", default: () => "NOW()" })
    @ApiProperty({ example: "2020-01-01T11:11:00.111Z" })
    createdAt: Date;

    @Column({ name: "valid", default: "true" })
    @ApiProperty({ example: "true or false" })
    valid: string;

    @ManyToOne(
        type => User,
        user => user.tickets,
        { nullable: false, onUpdate: "CASCADE", onDelete: "CASCADE" },
    )
    @Transform(user => user.id)
    @ApiProperty({
        name: "userId",
        type: "string",
        example: "fe7bb967-de22-44bf-b15f-5db184e9529c",
    })
    user: User;
}
