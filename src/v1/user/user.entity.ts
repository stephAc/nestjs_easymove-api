import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";

export enum UserRole {
    ADMIN = 20,
    CLIENT = 10,
}

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100 })
    @Index({ unique: true })
    email: string;

    @Column({ type: "varchar", length: 100 })
    username: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
