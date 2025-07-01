import TeacherPaymentInfoInMemoryRepository
    from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.inMemoryRepository";

type TeacherPaymentInfosToSave = {
    companyName: unknown;
    siret: unknown;
    businessType: unknown;
    vatExempted: unknown;
    iban: unknown;
    bic: unknown;
}


export const useSaveTeacherPaymentInfos = () => {

    const teacherPaymentInfoRepo = new TeacherPaymentInfoInMemoryRepository();

    const saveTeacherPaymentInfosUsecase = (teacherPaymentInfos: TeacherPaymentInfosToSave) => {

        try {
            teacherPaymentInfoRepo.execute(teacherPaymentInfos);
        } catch (error) {
            throw new Error('Failed to save teacher payment information');
        }
    }

    return saveTeacherPaymentInfosUsecase;

}
