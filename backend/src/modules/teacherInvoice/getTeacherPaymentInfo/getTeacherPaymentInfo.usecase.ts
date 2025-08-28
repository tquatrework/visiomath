import {Inject} from "@nestjs/common";
import {GetTeacherPaymentInfoUserRepository} from "./getTeacherPaymentInfo.user.repository";
import {GetTeacherPaymentInfoTeacherPaymentInfoRepository} from "./getTeacherPaymentInfo.teacherPaymentInfo.repository";
import {GetTeacherPaymentInfoUserTypeOrmRepository} from "./getTeacherPaymentInfo.user.typeOrmRepository";
import {GetTeacherPaymentInfoTeacherPaymentInfoTypeOrmRepository} from "./getTeacherPaymentInfo.teacherPaymentInfo.typeOrmRepository";
import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";

export class GetTeacherPaymentInfoUsecase {

    constructor(
        @Inject(GetTeacherPaymentInfoUserTypeOrmRepository)
        private getTeacherPaymentInfoUserRepository: GetTeacherPaymentInfoUserRepository,
        @Inject(GetTeacherPaymentInfoTeacherPaymentInfoTypeOrmRepository)
        private getTeacherPaymentInfoTeacherPaymentInfoRepository: GetTeacherPaymentInfoTeacherPaymentInfoRepository
    ) {}

    async execute(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult> {
        const user = await this.getTeacherPaymentInfoUserRepository.findUserById(teacherId);
        if (!user) {
            throw new Error('Professeur non trouvé');
        }

        let result: GetTeacherPaymentInfoQueryResult | null;

        try {
            result = await this.getTeacherPaymentInfoTeacherPaymentInfoRepository.findByTeacherId(teacherId);
        } catch (err) {
            throw new Error('Impossible de récupérer les informations de paiement');
        }

        if (!result) {
            throw new Error('Professeur non trouvé');
        }

        return result;
    }
}
