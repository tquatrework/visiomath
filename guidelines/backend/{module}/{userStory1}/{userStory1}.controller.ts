import {Controller, Get, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {{UserStory1}Usecase} from "./{userStory1}.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class {UserStory1}Controller {

    constructor(private readonly {userStory1}Usecase: {UserStory1}Usecase) {}

    @Get('/{userStory1-route}')
    async get{UserStory1}(
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {
        try {
            const result = await this.{userStory1}Usecase.execute(user.id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
