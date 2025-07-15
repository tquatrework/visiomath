import {
    useGetTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository.provider";

import { useState, useEffect } from "react";
import {
    GetTeacherPaymentInfoQueryResult
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.queryResult";

export const useGetTeacherPaymentInfoUsecase = () => {

    const getTeacherPaymentInfoRepository = useGetTeacherPaymentInfoRepository()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teacherPaymentInfo, setTeacherPaymentInfo] = useState<GetTeacherPaymentInfoQueryResult | null>(null);

    const getTeacherPaymentInfoQuery = async () => {
        if (!getTeacherPaymentInfoRepository) {
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const data = await getTeacherPaymentInfoRepository.execute();
            setTeacherPaymentInfo(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Récupération des informations de paiement impossible.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTeacherPaymentInfoQuery();
    }, [getTeacherPaymentInfoRepository]);

    return { teacherPaymentInfo, loading, error};
}
