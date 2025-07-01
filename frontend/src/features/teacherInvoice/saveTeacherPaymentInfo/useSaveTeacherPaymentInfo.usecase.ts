import {
    useGetSaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository.provider";
import {
    TeacherPaymentInfosModel
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model";

export const useSaveTeacherPaymentInfos = () => {

    const saveTeacherPaymentInfoRepository = useGetSaveTeacherPaymentInfoRepository()

    const saveTeacherPaymentInfosUsecase = (teacherPaymentInfos: TeacherPaymentInfosModel) => {

        if (teacherPaymentInfos.siret.length < 14) {
            throw new Error('Le SIRET doit contenir 14 caractères');
        }

        try {
            saveTeacherPaymentInfoRepository.execute(teacherPaymentInfos);
        } catch (error) {
            throw new Error('Failed to save teacher payment information');
        }
    }

    return saveTeacherPaymentInfosUsecase;

}
