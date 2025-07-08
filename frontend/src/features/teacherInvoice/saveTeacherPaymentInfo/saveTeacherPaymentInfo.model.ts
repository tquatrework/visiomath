export type TeacherPaymentInfosModel = {
    companyName: string;
    siret: string;
    companyType: 'AE' | 'SARL' | 'SA';
    vatExempt: boolean;
    iban: string;
    bic: string;
}

