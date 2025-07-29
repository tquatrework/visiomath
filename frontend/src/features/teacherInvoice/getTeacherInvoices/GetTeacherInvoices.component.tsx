import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTeacherInvoices } from './useGetTeacherInvoices.usecase';

export const GetTeacherInvoicesComponent: React.FC = () => {
  const { loading, error, data } = useGetTeacherInvoices();
  const navigate = useNavigate();

  const handleViewInvoice = (invoiceId: number) => {
    navigate(`/teacher-facturation/invoice/${invoiceId}`);
  };

  if (loading) {
    return <div className="text-gray-500">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error}</div>;
  }

  if (!data || data.teacherInvoices.length === 0) {
    return <div className="text-gray-500">Aucune facture trouvée</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Factures des professeurs
      </h2>
      
      <div className="space-y-4">
        {data.teacherInvoices.map((invoice) => (
          <div 
            key={invoice.id} 
            data-testid={`teacher-invoice-${invoice.id}`}
            className="bg-gray-50 border rounded-lg p-4"
          >
            <div className="flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
                <div>
                  <span className="text-sm text-gray-500 block">Professeur</span>
                  <span className="font-medium">{invoice.teacherName}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Date de création</span>
                  <span className="font-medium">
                    {new Date(invoice.creationDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Statut</span>
                  <span className="font-medium">{invoice.status}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Montant</span>
                  <span className="font-medium text-green-600">{invoice.amount}€</span>
                </div>
              </div>
              <div className="ml-4">
                <button 
                  onClick={() => handleViewInvoice(invoice.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Voir la facture
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};