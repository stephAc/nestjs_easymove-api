import { ApiProperty } from "@nestjs/swagger";
import User from "../../user/user.entity";

export class LoginResponseDTO {
    @ApiProperty({ type: () => User })
    user = new User();

    @ApiProperty({
        type: "string",
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjEwN2QxLWU5OTQtNDI4ZC05MWQ4LTIwYzE3MjM4NjVlYiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTU4MzUwNjg5OSwiZXhwIjoxNTgzNTUwMDk5fQ.ghsxkWklzCKjzIHVG1Etung3yHfw6TRb_jng8UBhz3c",
    })
    token = "";
}
