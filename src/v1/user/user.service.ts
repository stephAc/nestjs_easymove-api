import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import User from "./user.entity";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { getConnection } from "typeorm";
import Ticket from "../ticket/ticket.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({ email });
    }

    public async findOneById(id: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ["navigo", "tickets"],
        });
    }

    public async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async update(
        id: string,
        userData: UpdateUserDTO,
    ): Promise<UpdateResult> {
        return await this.userRepository.update(id, userData);
    }

    public async updateNavigo(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async wallet(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async delete(userID: string): Promise<any> {
        return await this.userRepository.delete(userID);
    }
}
