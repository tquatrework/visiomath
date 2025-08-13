import React, { useEffect } from 'react';
import { useGetTeacherInvoiceDetail } from './useGetTeacherInvoiceDetail.usecase';
import {
  ValidateInvoiceSuccessInMemoryRepository
} from "@src/features/teacherInvoice/validateInvoice/test/validateInvoice.invoice.successInMemoryRepository";
import {ValidateInvoiceComponent} from "@src/features/teacherInvoice/validateInvoice/ValidateInvoice.component";
import {
  ValidateInvoiceRepositoryProvider
} from "@src/features/teacherInvoice/validateInvoice/validateInvoice.invoice.repository.provider";
import {
  ValidateInvoiceFetchRepository
} from "@src/features/teacherInvoice/validateInvoice/validateInvoice.invoice.fetchRepository";
import {
  RefuseInvoiceSuccessInMemoryRepository
} from "@src/features/teacherInvoice/refuseInvoice/test/refuseInvoice.invoice.inMemoryRepositories";
import {RefuseInvoiceComponent} from "@src/features/teacherInvoice/refuseInvoice/RefuseInvoice.component";
import {
  RefuseInvoiceProvider
} from "@src/features/teacherInvoice/refuseInvoice/refuseInvoice.invoice.repository.provider";
import {
  RefuseInvoiceFetchRepository
} from "@src/features/teacherInvoice/refuseInvoice/refuseInvoice.invoice.fetchRepository";
import {
  PayInvoiceInvoiceSuccessInMemoryRepository
} from "@src/features/teacherInvoice/payInvoice/test/payInvoice.invoice.inMemoryRepositories";
import {PayInvoiceComponent} from "@src/features/teacherInvoice/payInvoice/PayInvoice.component";
import {
  PayInvoiceInvoiceProvider
} from "@src/features/teacherInvoice/payInvoice/payInvoice.invoice.repository.provider";

type GetTeacherInvoiceDetailComponentProps = {
  invoiceId: number;
};

export const GetTeacherInvoiceDetailComponent: React.FC<GetTeacherInvoiceDetailComponentProps> = ({ invoiceId }) => {
  const { invoiceDetail, loading, error, getInvoiceDetail } = useGetTeacherInvoiceDetail();

  useEffect(() => {
    getInvoiceDetail(invoiceId);
  }, [invoiceId]);

  if (loading) {
    return <div className="text-gray-500">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  if (!invoiceDetail) {
    return <div className="text-gray-500">Aucune facture trouvée</div>;
  }

  console.log('Invoice Detail:', invoiceDetail);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Détail de la facture
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500 block">ID Facture</span>
              <span className="font-medium" data-testid="invoice-id">{invoiceDetail.id}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Professeur</span>
              <span className="font-medium" data-testid="invoice-teacher-name">{invoiceDetail.teacherName}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Montant</span>
              <span className="font-medium text-green-600" data-testid="invoice-amount">{invoiceDetail.amount}€</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Date de création</span>
              <span className="font-medium" data-testid="invoice-creation-date">{invoiceDetail.creationDate}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 block">Status</span>
              <span className="font-medium" data-testid="invoice-status">{invoiceDetail.status}</span>
            </div>

            <div >
              <span className="text-sm text-gray-500 block mb-2">Fichier PDF</span>
              <a
                  href={`/uploads/${invoiceDetail.pdfFile}`}
                  data-testid="invoice-pdf-download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Télécharger PDF
              </a>
            </div>

            <div className="md:col-span-2">
              <hr className="my-6 border-gray-300" />
              <span className="text-sm text-gray-500 block mb-4">Actions</span>
              
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <ValidateInvoiceRepositoryProvider
                      validateInvoiceRepository={new ValidateInvoiceFetchRepository()}>
                    <ValidateInvoiceComponent invoiceId={invoiceId}/>
                  </ValidateInvoiceRepositoryProvider>
                </div>

                <div className="flex-1">
                  <PayInvoiceInvoiceProvider
                      invoiceRepository={new PayInvoiceInvoiceSuccessInMemoryRepository()}>
                    <PayInvoiceComponent invoiceId={invoiceId}/>
                  </PayInvoiceInvoiceProvider>
                </div>
                
                <div className="flex-1">
                  <RefuseInvoiceProvider
                      refuseInvoiceRepository={new RefuseInvoiceFetchRepository()}>
                    <RefuseInvoiceComponent invoiceId={invoiceId} />
                  </RefuseInvoiceProvider>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};