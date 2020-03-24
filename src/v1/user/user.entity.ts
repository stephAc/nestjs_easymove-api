import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

export enum UserRole {
    ADMIN = 20,
    CLIENT = 10,
}

@Entity({ name: "users" })
export default class User {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({ example: "fe7bb967-de22-44bf-b15f-5db184e9529c" })
    id: string;

    @Column({ type: "varchar", length: 100 })
    @Index({ unique: true })
    @ApiProperty({ example: "test@test.com" })
    email: string;

    @Column({ type: "varchar", length: 100 })
    @ApiProperty({ example: "Martin" })
    username: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
    @ApiProperty({
        enum: UserRole,
        examples: [UserRole.CLIENT, UserRole.ADMIN],
    })
    role: UserRole;

    @CreateDateColumn({ name: "created_at" })
    @ApiProperty({ example: "2020-01-01T11:11:00.111Z" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    @ApiProperty({ example: "2020-01-01T11:11:00.111Z" })
    updatedAt: Date;
}