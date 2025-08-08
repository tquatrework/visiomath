import React from 'react';
import { useGetTeacherInvoicesNumberForCurrentMonth } from './useGetTeacherInvoicesNumberForCurrentMonth.usecase';

export function GetTeacherInvoicesNumberForCurrentMonthComponent() {
  const { loading, error, data } = useGetTeacherInvoicesNumberForCurrentMonth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="px-4 py-3 mb-4 text-red-800 bg-red-100 border border-red-300 rounded-lg">
        Erreur: {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const toastStyle = data.number >= 1 
    ? 'px-4 py-3 mb-4 text-amber-800 bg-amber-100 border border-amber-300 rounded-lg'
    : 'px-4 py-3 mb-4 text-blue-800 bg-blue-100 border border-blue-300 rounded-lg';

  return (
    <div className={toastStyle}>
      Nombre de factures créées pour le mois en cours : <span data-testid="teacher-invoices-number-for-current-month">{data.number}</span>
    </div>
  );
}