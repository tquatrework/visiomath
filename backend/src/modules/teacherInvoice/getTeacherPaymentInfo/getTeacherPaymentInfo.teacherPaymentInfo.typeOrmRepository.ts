import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {GetTeacherPaymentInfoTeacherPaymentInfoRepository} from "./getTeacherPaymentInfo.teacherPaymentInfo.repository";
import {GetTeacherPaymentInfoQueryResult} from "./getTeacherPaymentInfo.queryResult";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class GetTeacherPaymentInfoTeacherPaymentInfoTypeOrmRepository implements GetTeacherPaymentInfoTeacherPaymentInfoRepository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findByTeacherId(teacherId: number): Promise<GetTeacherPaymentInfoQueryResult | null> {
        const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userProfile', 'userProfile')
            .leftJoinAndSelect('userProfile.teacherProfile', 'teacherProfile')
            .where('user.id = :teacherId', { teacherId })
            .getOne();

        if (!user || !user.userProfile?.teacherProfile) {
            return null;
        }

        const teacherProfile = user.userProfile.teacherProfile;
        return {
            companyName: teacherProfile.companyName,
            siret: teacherProfile.siret,
            companyType: teacherProfile.companyType,
            subjectToVat: teacherProfile.subjectToVat,
            iban: teacherProfile.iban,
            bic: teacherProfile.bic
        };
    }
}