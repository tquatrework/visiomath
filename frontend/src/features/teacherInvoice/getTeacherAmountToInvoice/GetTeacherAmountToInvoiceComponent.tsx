import React from 'react';
import { useGetTeacherAmountToInvoiceUsecase } from './useGetTeacherAmountToInvoice.usecase';

const GetTeacherAmountToInvoiceComponent: React.FC = () => {
    const { amountToInvoice, loading, error } = useGetTeacherAmountToInvoiceUsecase();

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Montant à facturer</h2>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Solde actuel</label>
                    <p data-testid="teacher-amount-to-invoice" className="mt-1 text-sm text-gray-900">
                        {amountToInvoice?.amountToInvoice || 0}€
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GetTeacherAmountToInvoiceComponent;
