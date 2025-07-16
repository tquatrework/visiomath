import {Controller, Post, Res, Body, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {{UserStory2}Usecase} from "./{userStory2}.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class {UserStory2}Controller {

    constructor(private readonly {userStory2}Usecase: {UserStory2}Usecase) {}

    @Post('/{userStory2-route}')
    async {userStory2}(
        @Body() body: any,
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {
        if (typeof body !== "object" || typeof body.name !== 'string' || typeof body.firstName !== 'string') {
            return res.status(422).json({ message: 'Des données sont manquantes' });
        }

        try {
            await this.{userStory2}Usecase.execute(user.id, body);
            return res.status(201).send();
        } catch (error) {
            if (error instanceof Error) {
                return res.status(422).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
