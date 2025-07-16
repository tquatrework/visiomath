import {Inject} from "@nestjs/common";
import {GetTeacherPaymentInfoRepository} from "./getTeacherPaymentInfo.repository";
import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";

export class GetTeacherPaymentInfoUsecase {

    constructor(
        private getTeacherPaymentInfoRepository: GetTeacherPaymentInfoRepository
    ) {}

    async execute(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult> {
        
        try {
            const result = await this.getTeacherPaymentInfoRepository.findByTeacherId(teacherId);
            
            if (!result) {
                throw new Error("Professeur non trouvé");
            }
            
            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Erreur interne du serveur");
        }
    }
}
