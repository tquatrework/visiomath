import React from 'react';
import { useGetCurrentTeacherInvoices } from './useGetCurrentTeacherInvoices.usecase';

export const GetCurrentTeacherInvoicesComponent: React.FC = () => {
    const { invoices, loading, error } = useGetCurrentTeacherInvoices();

    if (loading) {
        return <div className="text-gray-500">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-500">Erreur: {error}</div>;
    }

    if (!invoices || invoices.invoices.length === 0) {
        return <div className="text-gray-500">Aucune facture trouvée</div>;
    }

    return (
        <div className="space-y-4">
            {invoices.invoices.map((invoice) => (
                <div key={invoice.id} className="bg-gray-50 border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div>
                            <span className="text-sm text-gray-500 block">ID Facture</span>
                            <span className="font-medium" data-testid={`invoice-id-${invoice.id}`}>{invoice.id}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">Status</span>
                            <span className="font-medium" data-testid={`invoice-status-${invoice.id}`}>{invoice.status}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">Montant</span>
                            <span className="font-medium text-green-600" data-testid={`invoice-amount-${invoice.id}`}>{invoice.amount}</span><span className="text-sm text-gray-500"> €</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">Date de création</span>
                            <span className="font-medium" data-testid={`invoice-creation-date-${invoice.id}`}>{invoice.creationDate}</span>
                        </div>
                        <div className="flex justify-end">
                            <a 
                                href={`/uploads/${invoice.pdfFile}`}
                                data-testid={`invoice-pdf-download-${invoice.id}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                download
                            >
                                Télécharger PDF
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};