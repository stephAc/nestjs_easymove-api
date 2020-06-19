import {
    Controller,
    Get,
    HttpStatus,
    HttpException,
    UseGuards,
    Res,
    Param,
    Post,
    ClassSerializerInterceptor,
    UseInterceptors,
    Delete,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiBody,
    getSchemaPath,
    ApiParam,
} from "@nestjs/swagger";
import User, { UserRole } from "../user/user.entity";
import { RequestUser } from "../user/user.decorator";
import Navigo from "./navigo.entity";
import { NavigoService } from "./navigo.service";
import { UserService } from "../user/user.service";

@Controller("navigo")
@UseGuards(AuthGuard("jwt"))
@ApiTags("Navigo")
@ApiBearerAuth()
export class NavigoController {
    public constructor(
        private readonly navigoService: NavigoService,
        private readonly userService: UserService,
    ) {}
}
