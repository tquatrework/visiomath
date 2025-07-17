import React from 'react';
import GetTeacherAmountToInvoiceComponent
    from "@src/features/teacherInvoice/getTeacherAmountToInvoice/GetTeacherAmountToInvoiceComponent";
import {
    GetTeacherAmountToInvoiceProvider
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.repository.provider";
import {
    GetTeacherAmountToInvoiceFetchRepository
} from "@src/features/teacherInvoice/getTeacherAmountToInvoice/getTeacherAmountToInvoice.fetchRepository";

const TeacherInvoicePage: React.FC = () => {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Facturation Enseignant</h2>

            <GetTeacherAmountToInvoiceProvider
                getTeacherAmountToInvoiceRepository={new GetTeacherAmountToInvoiceFetchRepository()}>
                <GetTeacherAmountToInvoiceComponent/>
            </GetTeacherAmountToInvoiceProvider>
        </div>
    );
};

export default TeacherInvoicePage;
