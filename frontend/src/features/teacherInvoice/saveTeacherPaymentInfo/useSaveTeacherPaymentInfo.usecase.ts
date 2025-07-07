import {
    useGetSaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository.provider";
import {
    TeacherPaymentInfosModel
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model";

export const useSaveTeacherPaymentInfos = () => {

    const saveTeacherPaymentInfoRepository = useGetSaveTeacherPaymentInfoRepository()

    const saveTeacherPaymentInfosUsecase = async (teacherPaymentInfos: TeacherPaymentInfosModel) => {

        try {
            await saveTeacherPaymentInfoRepository.execute(teacherPaymentInfos);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error("Enregistrement des informations de paiement impossible.");
            }
        }
    }

    return saveTeacherPaymentInfosUsecase;

}
