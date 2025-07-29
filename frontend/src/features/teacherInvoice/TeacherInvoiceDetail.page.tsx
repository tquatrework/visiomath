import React from 'react';
import { useParams } from 'react-router-dom';
import { GetTeacherInvoiceDetailProvider } from './getTeacherInvoiceDetail/getTeacherInvoiceDetail.teacherInvoice.repository.provider';
import { GetTeacherInvoiceDetailComponent } from './getTeacherInvoiceDetail/GetTeacherInvoiceDetail.component';
import {
    GetTeacherInvoiceDetailTeacherInvoiceFetchRepository
} from "@src/features/teacherInvoice/getTeacherInvoiceDetail/getTeacherInvoiceDetail.teacherInvoice.fetchRepository";

const TeacherInvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div className="text-red-500">ID de facture manquant</div>;
  }

  return (
    <div className="p-6">
      <GetTeacherInvoiceDetailProvider
        getTeacherInvoiceDetailRepository={new GetTeacherInvoiceDetailTeacherInvoiceFetchRepository()}
      >
        <GetTeacherInvoiceDetailComponent invoiceId={parseInt(id)} />
      </GetTeacherInvoiceDetailProvider>
    </div>
  );
};

export default TeacherInvoiceDetailPage;