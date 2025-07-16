import {CompanyType} from "../../../shared/entities/teacherProfile.entity";

export type GetTeacherPaymentInfoQueryResult = {
    companyName: string;
    siret: string;
    companyType: CompanyType;
    vatExempt: boolean;
    iban: string;
    bic: string;
}
