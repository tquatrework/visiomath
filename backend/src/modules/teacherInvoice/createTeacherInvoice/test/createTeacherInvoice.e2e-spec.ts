import request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {DataSource} from "typeorm";
import {UserBuilder} from "../../../../common/test/fixture/userBuilder";
import {beforeEach, afterEach, describe, expect, test} from "vitest";
import * as fs from 'fs';
import * as path from 'path';

declare global {
    var app: INestApplication;
}

describe('US-6: Création d\'une facture', () => {
    let createdPdfPath: string | null = null;
    
    afterEach(() => {
        if (createdPdfPath && typeof createdPdfPath === 'string') {
            try {
                if (fs.existsSync(createdPdfPath)) {
                    fs.unlinkSync(createdPdfPath);
                    console.log(`Fichier temporaire supprimé: ${createdPdfPath}`);
                }
            } catch (error) {
                console.error(`Erreur lors de la suppression du fichier: ${error}`);
            }
        }
    });

    test('US-6-AC-1-1: Envoie réussie: facture créée', async () => {

        // Etant donné que je suis connecté en tant que professeur 
        const userBuilder = new UserBuilder(app).withId(1).withRole("teacher").withFirstName("Thierry").withLastName("Teacher");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const res = await request(app.getHttpServer())
            .post('/create-teacher-invoice')
            .set('Authorization', `Bearer ${teacherToken}`)
            .field('amount', '600')
            .attach('pdfFile', Buffer.from('%PDF-1.5\nfake pdf content'), {
                filename: 'invoice_file.pdf',
                contentType: 'application/pdf'
            });
        
        // Alors une facture contenant : montant, fichier pdf, date de création, professeur (moi) et status 'en attente de validation' doit être créée
        expect(res.status).toBe(201);
        
        // Vérifier que la facture a été créée en base de données
        const teacherInvoice = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_invoices WHERE "teacherId" = $1 ORDER BY id DESC LIMIT 1', [1]);
        
        expect(teacherInvoice[0]).toBeDefined();
        expect(teacherInvoice[0].amount).toBe(600);
        expect(teacherInvoice[0].pdfFile).toContain("invoice-thierryteacher");
        expect(teacherInvoice[0].status).toBe("en attente de validation");
        expect(new Date(teacherInvoice[0].creationDate)).toBeInstanceOf(Date);
        
        createdPdfPath = teacherInvoice[0].pdfFile;

    })

    test('US-6-AC-1-2: fichier pdf enregistré', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const userBuilder = new UserBuilder(app).withId(1).withRole("teacher").withFirstName("Thierry").withLastName("Teacher");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();

        // Quand j'envoie un montant de 600e et un fichier PDF
        const res = await request(app.getHttpServer())
            .post('/create-teacher-invoice')
            .set('Authorization', `Bearer ${teacherToken}`)
            .field('amount', '600')
            .attach('pdfFile', Buffer.from('%PDF-1.5\nfake pdf content'), {
                filename: 'invoice_file.pdf',
                contentType: 'application/pdf'
            });

        // Alors une facture contenant : montant, fichier pdf, date de création, professeur (moi) et status 'en attente de validation' doit être créée
        expect(res.status).toBe(201);

        // Vérifier que la facture a été créée en base de données
        const teacherInvoice = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_invoices WHERE "teacherId" = $1 ORDER BY id DESC LIMIT 1', [1]);

        createdPdfPath = teacherInvoice[0].pdfFile;

        expect(createdPdfPath).not.toBeNull();
        if (createdPdfPath) {
            expect(fs.existsSync(createdPdfPath)).toBe(true);

            // Vérifier le contenu du fichier
            const fileContent = fs.readFileSync(createdPdfPath);
            expect(fileContent.toString()).toContain('%PDF-1.5');
            expect(fileContent.length).toBeGreaterThan(0);
        }
});

    test('US-6-AC-2: Envoie échoué, utilisateur non teacher', async () => {

        // Etant donné que je suis connecté en tant que responsable financier
        const userBuilder = new UserBuilder(app).withId(2).withRole("financial_admin").withFirstName("Admin").withLastName("Financier");
        await userBuilder.build();
        const financialAdminToken = await userBuilder.getToken();
        
        // Quand j'envoie un montant de 600e et un fichier PDF
        const res = await request(app.getHttpServer())
            .post('/create-teacher-invoice')
            .set('Authorization', `Bearer ${financialAdminToken}`)
            .field('amount', '600')
            .attach('pdfFile', Buffer.from('%PDF-1.5\nfake pdf content'), {
                filename: 'invoice_file.pdf',
                contentType: 'application/pdf'
            });
        
        // Alors une erreur "Vous ne pouvez pas créer de facture" doit être envoyée
        expect(res.status).toBe(422);
        expect(res.body.message).toBe("Vous ne pouvez pas créer de facture");
        
        // Vérifier qu'aucune facture n'a été créée
        const invoices = await app
            .get(DataSource)
            .query('SELECT * FROM teacher_invoices WHERE "teacherId" = $1', [2]);
        
        expect(invoices).toHaveLength(0);
    });

    test('US-6-AC-6: Envoie échoué, montant non envoyé', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const userBuilder = new UserBuilder(app).withId(3).withRole("teacher").withFirstName("Paul").withLastName("Professeur");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();
        
        // Quand j'envoie un fichier PDF sans montant
        const res = await request(app.getHttpServer())
            .post('/create-teacher-invoice')
            .set('Authorization', `Bearer ${teacherToken}`)
            .attach('pdfFile', Buffer.from('%PDF-1.5\nfake pdf content'), {
                filename: 'invoice_file.pdf',
                contentType: 'application/pdf'
            });
        
        // Alors une erreur "Le montant est obligatoire" doit être envoyée
        expect(res.status).toBe(422);
        expect(res.body.message).toBe("Le montant est obligatoire");
    });

    test('US-6-AC-7: Envoie échoué, fichier non envoyé', async () => {

        // Etant donné que je suis connecté en tant que professeur
        const userBuilder = new UserBuilder(app).withId(4).withRole("teacher").withFirstName("Sophie").withLastName("Enseignante");
        await userBuilder.build();
        const teacherToken = await userBuilder.getToken();
        
        // Quand j'envoie un montant sans fichier PDF
        const res = await request(app.getHttpServer())
            .post('/create-teacher-invoice')
            .set('Authorization', `Bearer ${teacherToken}`)
            .field('amount', '600')

        // Alors une erreur "La facture PDF est obligatoire" doit être envoyée
        expect(res.status).toBe(422);
        expect(res.body.message).toBe("La facture PDF est obligatoire");

    });

})
