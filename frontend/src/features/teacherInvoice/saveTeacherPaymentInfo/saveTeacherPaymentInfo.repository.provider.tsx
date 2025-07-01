import {
    SaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";
import {createContext, useContext} from "react";

export const saveTeacherPaymentInfoRepositoryContext = createContext<SaveTeacherPaymentInfoRepository | null>(null)


export const SaveTeacherPaymentInfoRepositoryProvider: React.FC<{ children: React.ReactNode, saveTeacherPaymentInfoRepository?: SaveTeacherPaymentInfoRepository }> = ({ children, saveTeacherPaymentInfoRepository }) => {

    return (
        <saveTeacherPaymentInfoRepositoryContext.Provider value={saveTeacherPaymentInfoRepository}>
            {children}
        </saveTeacherPaymentInfoRepositoryContext.Provider>
    );
};


export const useGetSaveTeacherPaymentInfoRepository = () => {

    const saveTeacherPaymentInfoRepository = useContext(saveTeacherPaymentInfoRepositoryContext);
    if (!saveTeacherPaymentInfoRepository) {
        throw new Error("SaveTeacherPaymentInfoRepository is not provided. Please wrap your component with SaveTeacherPaymentInfoRepositoryProvider.");
    }

    return saveTeacherPaymentInfoRepository;
}