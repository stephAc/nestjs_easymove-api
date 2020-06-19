import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Navigo from "./navigo.entity";
import User from "../user/user.entity";

@Injectable()
export class NavigoService {
    constructor(
        @InjectRepository(Navigo)
        private readonly navigoRepository: Repository<Navigo>,
    ) {}
}
