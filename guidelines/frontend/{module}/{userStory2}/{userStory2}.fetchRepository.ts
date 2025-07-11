import {
    {userStory2}Repository,
} from "@src/features/{module}/{userStory2}/{userStory2}.repository";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";
import {
    {UserStory2}Command
} from "@src/features/{module}/{userStory2}/{userStory2}.command";

export class SaveTeacherPaymentFetchRepository
    implements {userStory2}Repository
{

    async execute({userStory2}Command: {UserStory2}Command): Promise<void> {
        try {
            await apiSec.post('/teacher-payment-info', {userStory2}Command);

        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Enregistrement des informations de paiement impossible.';
                throw new Error(message);
            }
        }
    }

}
