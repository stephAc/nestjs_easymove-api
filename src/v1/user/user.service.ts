import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create_user.dto";
import { User } from "./user.entity";

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
        return await this.userRepository.findOne(id);
    }

    public async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
