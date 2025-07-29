import {
    {UserStory2}Command
} from "@src/features/{module}/{userStory2}/{userStory2}.command";

export interface {userStory2}Repository {
    execute(teacherPaymentInfo: {UserStory2}Command): Promise<void>
}