import { CreateTeacherInvoiceCommand } from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.command";
import { useGetCreateTeacherInvoiceRepository } from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.repository.provider";
import { useState } from "react";

export const useCreateTeacherInvoiceUseCase = () => {

    const createTeacherInvoiceRepository = useGetCreateTeacherInvoiceRepository();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createTeacherInvoiceCommandHandler = async (createTeacherInvoiceCommand: CreateTeacherInvoiceCommand) => {

        if (!createTeacherInvoiceRepository) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            await createTeacherInvoiceRepository.execute(createTeacherInvoiceCommand);
            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erreur lors de la création de la facture.");
            }
        } finally {
            setLoading(false);
        }
    }

    return { createTeacherInvoiceCommandHandler, loading, error, success };
}
