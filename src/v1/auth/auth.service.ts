import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { LoginRequestDTO } from "./dto/login-request.dto";
import { LoginResponseDTO } from "./dto/login-response.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser({
        email,
        password,
    }: LoginRequestDTO): Promise<LoginResponseDTO> {
        const user = await this.userService.findOneByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            const { id, email } = user;
            const token = this.jwtService.sign({ id, email });
            return { user, token };
        }

        throw new ForbiddenException("Identifiants incorrects");
    }
}
