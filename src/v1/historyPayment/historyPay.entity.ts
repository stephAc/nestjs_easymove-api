import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../user/user.entity";

export enum HistoryPayType {
    TICKET = "ticket",
    PASS = "pass",
    REFUND = "refund",
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}

@Entity({ name: "historyPay" })
export default class HistoryPay {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: "1" })
    id: number;

    @Column({
        type: "enum",
        enum: HistoryPayType,
    })
    @ApiProperty({
        enum: HistoryPayType,
        example: HistoryPayType,
    })
    action: HistoryPayType;

    @Column()
    @ApiProperty({ example: "1.80" })
    price: string;

    @Column({ name: "date_purchase", default: () => "Now()" })
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
