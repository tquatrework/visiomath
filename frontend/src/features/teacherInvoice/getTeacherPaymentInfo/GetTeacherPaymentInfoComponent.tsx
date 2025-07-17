import React from 'react';
import { useGetTeacherPaymentInfoUsecase } from './useGetTeacherPaymentInfo.usecase';

const GetTeacherPaymentInfoComponent: React.FC = () => {
    const { paymentInfo, loading, error } = useGetTeacherPaymentInfoUsecase();

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations de paiement</h2>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                    <p data-testid="company-name" className="mt-1 text-sm text-gray-900">{paymentInfo?.companyName || ''}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">SIRET</label>
                    <p data-testid="siret" className="mt-1 text-sm text-gray-900">{paymentInfo?.siret || ''}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type d'entreprise</label>
                    <p data-testid="company-type" className="mt-1 text-sm text-gray-900">
                        {paymentInfo?.companyType || ''}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Assujetti TVA</label>
                    <p data-testid="vat-subject" className="mt-1 text-sm text-gray-900">
                        {paymentInfo?.subjectToVat ? 'oui' : 'non'}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">IBAN</label>
                    <p data-testid="iban" className="mt-1 text-sm text-gray-900">
                        {paymentInfo?.iban?.replace(/\s/g, '') || ''}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">BIC</label>
                    <p data-testid="bic" className="mt-1 text-sm text-gray-900">{paymentInfo?.bic || ''}</p>
                </div>
            </div>
        </div>
    );
};

export default GetTeacherPaymentInfoComponent;
