export type TeacherPaymentInfosModel = {
    companyName: string;
    siret: string;
    businessType: 'AE' | 'SARL' | 'SA';
    vatExempted: boolean;
    iban: string;
    bic: string;
}

