import { useState, useEffect } from 'react';
import { useCreateTeacherInvoiceUseCase } from '@src/features/teacherInvoice/createTeacherInvoice/useCreateTeacherInvoice.usecase';

const CreateTeacherInvoiceComponent = () => {
    const { createTeacherInvoiceCommandHandler, error: createTeacherInvoiceError, success: createTeacherInvoiceSuccess } = useCreateTeacherInvoiceUseCase();

    const [formData, setFormData] = useState({
        amount: '',
        pdfFile: null as File | null
    });


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.pdfFile) {
            alert('Veuillez sélectionner un fichier PDF');
            return;
        }

        const createTeacherInvoiceCommand = {
            amount: parseFloat(formData.amount),
            pdfFile: formData.pdfFile,
        };

        await createTeacherInvoiceCommandHandler(createTeacherInvoiceCommand);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFormData(prev => ({
            ...prev,
            amount: e.target.value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            pdfFile: file
        }));
    };

    if (createTeacherInvoiceSuccess) {
        return <div className="text-green-500">Facture envoyée avec succès</div>;
    }

    if (createTeacherInvoiceError) {
        return <div className="text-red-500">Erreur: {createTeacherInvoiceError}</div>;
    }

    return (
        <div>
            <form
                className="p-6 bg-white shadow-md rounded-lg"
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Créer une facture
                </h2>

                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Montant
                    </label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        required
                        className="w-full mt-1 p-2 border rounded-md"
                        value={formData.amount}
                        onChange={handleAmountChange}
                        onKeyDown={(e) => {
                            // Empêcher la soumission du formulaire sur la touche backspace dans ce champ
                            if (e.key === 'Backspace') {
                                e.stopPropagation();
                            }
                        }}
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="pdfFile"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Facture PDF
                    </label>
                    <input
                        id="pdfFile"
                        name="pdfFile"
                        type="file"
                        accept=".pdf"
                        className="w-full mt-1 p-2 border rounded-md"
                        onChange={handleFileChange}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 mx-auto block w-1/3 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default CreateTeacherInvoiceComponent;
