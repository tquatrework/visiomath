export enum GetTeacherPaymentInfoCompanyType {
    Autoentrepreneur = 'Autoentrepreneur',
    EI = 'EI',
    EURL = 'EURL',
    SARL = 'SARL',
    SA = 'SA',
    SAS = 'SAS',
    SASU = 'SASU',
    SNC = 'SNC',
    Scop = 'Scop',
    Association = 'Association'
}

export type GetTeacherPaymentInfoQueryResult = {
    companyName: string;
    siret: string;
    companyType: GetTeacherPaymentInfoCompanyType;
    subjectToVat: boolean;
    iban: string;
    bic: string;
}
