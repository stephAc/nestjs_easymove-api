import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { JwtPayload } from "./interface/jwtPayload.interface";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "secret",
        });
    }

    async validate(payload: JwtPayload): Promise<{}> {
        const { id, email } = payload;

        const user = await this.userService.findOneById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        const { password, ...result } = user;
        return result;
    }
}
