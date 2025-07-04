import {INestApplication} from "@nestjs/common";
import {DataSource} from "typeorm";
import {JwtService} from "@nestjs/jwt";

const  generateUserToken = async (app: INestApplication, role: string): Promise<string> => {
    const dataSource = app.get(DataSource);

    await dataSource.query(`
        INSERT INTO public.user_profiles (id, passions, avatar) VALUES (1, 'dev', 'test.png');
        INSERT INTO public.teacher_profiles (id, diplomes, experience, specialites, particularites, "cvUrl", "userProfileId") VALUES (1, 'test', '5', 'dev', 'dev', 'dev.pdf', 1);
        INSERT INTO public.users (id, email, password, "isActive", pseudo, "firstName", "lastName", "dateOfBirth", address, "zipCode", city, "phoneNumber", created_at, updated_at, "userProfileId", role) VALUES (1, 'test33@gmail.com', '$2b$10$2sC2EI44j/j2MatHiRKakO.j8wRga3Pg5d36pf9KMBK0JZ84YsOyW', true, 'David robert33', 'David', 'robert', '1900-01-01', null, null, null, null, '2025-06-30 08:35:42.907208', '2025-06-30 08:35:42.907208', 1, '${role}');
    `)

    const payload = { sub: 1, role: role };
    const jwt = app.get(JwtService)
    const token = await jwt.signAsync({
        sub: 1,
        role: role
    }, { expiresIn: '1d' });


    return token;
}

export default generateUserToken;