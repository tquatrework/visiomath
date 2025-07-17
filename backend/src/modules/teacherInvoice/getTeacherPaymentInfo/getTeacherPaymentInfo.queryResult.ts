import {CompanyType} from "../../../shared/entities/teacherProfile.entity";

export type GetTeacherPaymentInfoQueryResult = {
    companyName: string;
    siret: string;
    companyType: CompanyType;
    subjectToVat: boolean;
    iban: string;
    bic: string;
}
