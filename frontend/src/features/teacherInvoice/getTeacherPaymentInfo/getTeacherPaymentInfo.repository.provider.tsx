import {
    GetTeacherPaymentInfoRepository
} from "@src/features/teacherInvoice/getTeacherPaymentInfo/getTeacherPaymentInfo.repository";
import {createContext, useContext} from "react";

export const getTeacherPaymentInfoRepositoryContext = createContext<GetTeacherPaymentInfoRepository | null>(null)


export const GetTeacherPaymentInfoProvider: React.FC<{ children: React.ReactNode, getTeacherPaymentInfoRepository?: GetTeacherPaymentInfoRepository }> = ({ children, getTeacherPaymentInfoRepository }) => {

    return (
        <getTeacherPaymentInfoRepositoryContext.Provider value={getTeacherPaymentInfoRepository || null}>
            {children}
        </getTeacherPaymentInfoRepositoryContext.Provider>
    );
};


export const useGetTeacherPaymentInfoRepository = () => {

    const getTeacherPaymentInfoRepository = useContext(getTeacherPaymentInfoRepositoryContext);
    
    return getTeacherPaymentInfoRepository;
}
