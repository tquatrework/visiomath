export enum {userStory1}CompanyType {
    Autoentrepreneur = 'Autoentrepreneur',
    EI = 'EI',
    EURL = 'EURL',
    SARL = 'SARL',
    SA = 'SA',
    SAS = 'SAS',
}

export type UserStory1QueryResult = {
    companyName: string;
    siret: string;
    companyType: {userStory1}CompanyType;
    vatSubject: boolean;
    iban: string;
    bic: string;
}
