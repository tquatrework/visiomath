import {
    CreateTeacherInvoiceRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.repository";
import {createContext, useContext} from "react";

export const createTeacherInvoiceRepositoryContext = createContext<CreateTeacherInvoiceRepository | null>(null)


export const CreateTeacherInvoiceRepositoryProvider: React.FC<{ children: React.ReactNode, createTeacherInvoiceRepository?: CreateTeacherInvoiceRepository }> = ({ children, createTeacherInvoiceRepository }) => {

    return (
        <createTeacherInvoiceRepositoryContext.Provider value={createTeacherInvoiceRepository || null}>
            {children}
        </createTeacherInvoiceRepositoryContext.Provider>
    );
};


export const useGetCreateTeacherInvoiceRepository = () => {

    const createTeacherInvoiceRepository = useContext(createTeacherInvoiceRepositoryContext);
    
    return createTeacherInvoiceRepository;
}
