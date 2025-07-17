import {INestApplication} from "@nestjs/common";
import {DataSource} from "typeorm";
import {JwtService} from "@nestjs/jwt";

export interface PaymentInfo {
    companyName: string;
    siret: string;
    companyType: string;
    subjectToVat: boolean;
    iban: string;
    bic: string;
}

export class UserBuilder {
    private app: INestApplication;
    private userId: number = 1;
    private role: string = 'user';
    private teacherProfileId: number | null = null;
    private paymentInfo: PaymentInfo | null = null;

    constructor(app: INestApplication) {
        this.app = app;
    }

    withId(id: number): UserBuilder {
        this.userId = id;
        return this;
    }

    withRole(role: string): UserBuilder {
        this.role = role;
        return this;
    }

    withTeacherProfileId(teacherProfileId: number): UserBuilder {
        this.teacherProfileId = teacherProfileId;
        this.role = 'teacher';
        return this;
    }

    withPaymentInfo(paymentInfo: PaymentInfo): UserBuilder {
        this.paymentInfo = paymentInfo;
        if (!this.teacherProfileId) {
            this.teacherProfileId = this.userId;
        }
        this.role = 'teacher';
        return this;
    }

    async build(): Promise<void> {
        const dataSource = this.app.get(DataSource);

        await dataSource.query(
            `INSERT INTO public.user_profiles (id, passions, avatar) VALUES ($1, $2, $3)`,
            [this.userId, 'dev', 'test.png']
        );

        if (this.teacherProfileId) {
            await dataSource.query(
                `INSERT INTO public.teacher_profiles (id, diplomes, experience, specialites, particularites, "cvUrl", "userProfileId", "companyName", "siret", "companyType", "subjectToVat", "iban", "bic") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [
                    this.teacherProfileId,
                    'test',
                    '5',
                    'dev',
                    'dev',
                    'dev.pdf',
                    this.userId,
                    this.paymentInfo?.companyName || null,
                    this.paymentInfo?.siret || null,
                    this.paymentInfo?.companyType || null,
                    this.paymentInfo?.subjectToVat || null,
                    this.paymentInfo?.iban || null,
                    this.paymentInfo?.bic || null
                ]
            );
        }

        await dataSource.query(
            `INSERT INTO public.users (id, email, password, "isActive", pseudo, "firstName", "lastName", "dateOfBirth", address, "zipCode", city, "phoneNumber", created_at, updated_at, "userProfileId", role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
                this.userId,
                `test${this.userId}@gmail.com`,
                '$2b$10$2sC2EI44j/j2MatHiRKakO.j8wRga3Pg5d36pf9KMBK0JZ84YsOyW',
                true,
                `User ${this.userId}`,
                'Test',
                'User',
                '1900-01-01',
                null,
                null,
                null,
                null,
                new Date(),
                new Date(),
                this.userId,
                this.role
            ]
        );
    }

    async getToken(): Promise<string> {
        const jwt = this.app.get(JwtService);
        return await jwt.signAsync({
            sub: this.userId,
            role: this.role
        }, { expiresIn: '1d' });
    }
}
