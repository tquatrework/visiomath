import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { GetTeacherInvoiceDetailProvider } from './getTeacherInvoiceDetail/getTeacherInvoiceDetail.teacherInvoice.repository.provider';
import { GetTeacherInvoiceDetailComponent } from './getTeacherInvoiceDetail/GetTeacherInvoiceDetail.component';
import {
    GetTeacherInvoiceDetailTeacherInvoiceFetchRepository
} from "@src/features/teacherInvoice/getTeacherInvoiceDetail/getTeacherInvoiceDetail.teacherInvoice.fetchRepository";
import {useUser} from "@src/providers/UserContext";
const TeacherInvoiceDetailPage: React.FC = () => {

  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="text-red-500">ID de facture manquant</div>;
  }

    const { userInfo } = useUser();

    const isFinancialManager = userInfo?.role.includes('financial_admin');


    if (!isFinancialManager) {
        return null;
    }

  return (

      <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 data-testid="teacher-invoice-details-title" className="text-xl font-semibold mb-4 text-gray-800">Facturation Enseignant</h2>
          
          <div className="mb-6">
            <Link 
              to="/teacher-facturation"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la liste des factures
            </Link>
          </div>



            <div className="p-6">
              <GetTeacherInvoiceDetailProvider
                getTeacherInvoiceDetailRepository={new GetTeacherInvoiceDetailTeacherInvoiceFetchRepository()}
              >
                <GetTeacherInvoiceDetailComponent invoiceId={parseInt(id)} />
              </GetTeacherInvoiceDetailProvider>
            </div>


        </div>
  );
};

export default TeacherInvoiceDetailPage;