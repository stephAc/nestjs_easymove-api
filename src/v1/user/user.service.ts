import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import User from "./user.entity";
import { UpdateUserDTO } from "./dto/update-user.dto";

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

    public async update(
        id: string,
        userData: UpdateUserDTO,
    ): Promise<UpdateResult> {
        return await this.userRepository.update(id, userData);
    }

    public async wallet(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    public async delete(user: User): Promise<DeleteResult> {
        return await this.userRepository.delete(user.id);
    }
}
