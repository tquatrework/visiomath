import {
    SaveTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";
import {createContext, useContext} from "react";

export const saveTeacherPaymentInfoRepositoryContext = createContext<SaveTeacherPaymentInfoRepository | null>(null)


export const SaveTeacherPaymentInfoRepositoryProvider: React.FC<{ children: React.ReactNode, saveTeacherPaymentInfoRepository?: SaveTeacherPaymentInfoRepository }> = ({ children, saveTeacherPaymentInfoRepository }) => {

    return (
        <saveTeacherPaymentInfoRepositoryContext.Provider value={saveTeacherPaymentInfoRepository || null}>
            {children}
        </saveTeacherPaymentInfoRepositoryContext.Provider>
    );
};


export const useGetSaveTeacherPaymentInfoRepository = () => {

    const saveTeacherPaymentInfoRepository = useContext(saveTeacherPaymentInfoRepositoryContext);

    return saveTeacherPaymentInfoRepository;
}