import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity({ name: "users" })
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    password: string;
}
