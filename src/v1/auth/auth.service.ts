import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser({ email, password }: LoginDto): Promise<string> {
        const user = await this.userService.findOneByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { id, email } = user;
            return await this.jwtService.sign({ id, email });
        }

        throw new UnauthorizedException("Identifiants incorrects");
    }
}
