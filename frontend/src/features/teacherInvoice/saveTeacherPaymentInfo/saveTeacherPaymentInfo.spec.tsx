import { describe, expect, test } from "vitest";
import TeacherPaymentInfoForm from "@src/features/teacherInvoice/saveTeacherPaymentInfo/TeacherPaymentInfoForm";
import {render, waitFor, screen} from "@testing-library/react";

describe('#US-1: Enregistrement des informations personnelles / de paiement du professeur', async () => {

    test('#US-1-AC-1: Enregistrement réussi avec BIC 6 + 2', async () => {

        render(<TeacherPaymentInfoForm />);

        await waitFor(() => {
            expect(screen.getByRole('heading', {name: /Teacher Payment Information/i})).toBeInTheDocument();
        });

    })

});
