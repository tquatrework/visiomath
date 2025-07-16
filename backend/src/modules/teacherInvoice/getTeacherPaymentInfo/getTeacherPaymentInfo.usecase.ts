import {Inject} from "@nestjs/common";
import {GetTeacherPaymentInfoRepository} from "./getTeacherPaymentInfo.repository";
import {GetTeacherPaymentInfoTypeOrmRepository} from "./getTeacherPaymentInfo.typeOrmRepository";
import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";

export class GetTeacherPaymentInfoUsecase {

    constructor(
        @Inject(GetTeacherPaymentInfoTypeOrmRepository)
        private getTeacherPaymentInfoRepository: GetTeacherPaymentInfoRepository
    ) {}

    async execute(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult> {
        let result: GetTeacherPaymentInfoQueryResult | null;

        try {
            result = await this.getTeacherPaymentInfoRepository.findByTeacherId(teacherId);
        } catch (err) {
            throw new Error('Impossible de récupérer les informations de paiement');
        }

        if (!result) {
            throw new Error('Professeur non trouvé');
        }

        return result;
    }
}
