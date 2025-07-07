
import {
    TeacherPaymentInfosModel,
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model";
import {
    SaveTeacherPaymentInfoRepository,
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";

export class SaveTeacherPaymentFetchRepository
    implements SaveTeacherPaymentInfoRepository
{

    async execute(info: TeacherPaymentInfosModel): Promise<void> {
        try {
            await apiSec.post('/teacher-payment-info', info);

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
