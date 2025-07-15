import {
    useGetSaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository.provider";
import { useState } from "react";

export type TeacherPaymentInfosCommand = {
    companyName: string;
    siret: string;
    companyType: string;
    vatExempt: boolean;
    iban: string;
    bic: string;
}

export const useSaveTeacherPaymentInfoUseCase = () => {

    const saveTeacherPaymentInfoRepository = useGetSaveTeacherPaymentInfoRepository()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const saveTeacherPaymentInfosCommandHandler = async (teacherPaymentInfosCommand: TeacherPaymentInfosCommand) => {

        if (!saveTeacherPaymentInfoRepository) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            await saveTeacherPaymentInfoRepository.execute(teacherPaymentInfosCommand);
            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Enregistrement des informations de paiement impossible.");
            }
        } finally {
            setLoading(false);
        }
    }

    return { saveTeacherPaymentInfosCommandHandler, loading, error, success };

}
