import React, { useState } from 'react';
import { useRefuseInvoice } from './useRefuseInvoice.usecase';

interface RefuseInvoiceComponentProps {
    invoiceId: number;
}

export const RefuseInvoiceComponent: React.FC<RefuseInvoiceComponentProps> = ({ invoiceId }) => {
    const [refusalReason, setRefusalReason] = useState('');
    const { refuse, isLoading, error, success } = useRefuseInvoice();

    const handleRefuse = async () => {
        await refuse(invoiceId, refusalReason);
    };

    return (
        <>
            {success && <div className="text-green-500" data-testid="refusal-success-message">La facture a été refusée avec succès</div>}

            {error && <div className="text-red-500" data-testid="refusal-error-message">{error}</div>}

            <div className="space-y-3">

                <button
                    onClick={handleRefuse}
                    disabled={isLoading || !refusalReason.trim()}
                    aria-label="Refuser la facture"
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Refus en cours...' : 'Refuser la facture'}
                </button>

                <div>
                    <label htmlFor="refusal-reason" className="text-sm text-gray-500 block mb-1">
                        Motif de refus (obligatoire)
                    </label>
                    <textarea
                        id="refusal-reason"
                        aria-label="Motif de refus"
                        value={refusalReason}
                        onChange={(e) => setRefusalReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                        rows={3}
                        placeholder="Expliquez la raison du refus..."
                    />
                </div>
                

            </div>
        </>
    );
};