import { useState, useEffect } from 'react';
import {
    useSaveTeacherPaymentInfoUseCase,
} from '@src/features/teacherInvoice/saveTeacherPaymentInfo/useSaveTeacherPaymentInfo.usecase'
import {
    useGetTeacherPaymentInfoUsecase,
} from '@src/features/teacherInvoice/getTeacherPaymentInfo/useGetTeacherPaymentInfo.usecase'


const TeacherPaymentInfoFormComponent = () => {
    const { saveTeacherPaymentInfosCommandHandler, error: saveTeacherPaymentInfoError, success: saveTeacherPaymentInfoSuccess } = useSaveTeacherPaymentInfoUseCase()
    const { teacherPaymentInfo, error: getTeacherPaymentInfoError } = useGetTeacherPaymentInfoUsecase();

    const [formData, setFormData] = useState({
        companyName: '',
        siret: '',
        companyType: '',
        subjectToVat: false,
        iban: '',
        bic: ''
    });

    useEffect(() => {
        if (teacherPaymentInfo) {
            setFormData({
                companyName: teacherPaymentInfo.companyName || '',
                siret: teacherPaymentInfo.siret || '',
                companyType: teacherPaymentInfo.companyType || '',
                subjectToVat: teacherPaymentInfo.subjectToVat || false,
                iban: teacherPaymentInfo.iban || '',
                bic: teacherPaymentInfo.bic || ''
            });
        }
    }, [teacherPaymentInfo]);


    if (saveTeacherPaymentInfoSuccess) {
        alert('Enregistrement Ok')
    }

    if (saveTeacherPaymentInfoError) {
        alert(saveTeacherPaymentInfoError)
    }

    if (getTeacherPaymentInfoError) {
        alert(getTeacherPaymentInfoError)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const saveTeacherPaymentInfosCommand = {
            companyName: formData.companyName,
            siret: formData.siret,
            companyType: formData.companyType,
            subjectToVat: formData.subjectToVat,
            iban: formData.iban,
            bic: formData.bic,
        }
        await saveTeacherPaymentInfosCommandHandler(saveTeacherPaymentInfosCommand);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div>
            <form
                className="p-6 bg-white shadow-md rounded-lg"
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Informations de paiement
                </h2>

                <div className="mb-4">
                    <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Nom de l'entreprise
                    </label>
                    <input
                        id="companyName"
                        name="companyName"
                        required
                        className="w-full mt-1 p-2 border rounded-md"
                        value={formData.companyName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="siret"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Siret
                    </label>
                    <input
                        id="siret"
                        name="siret"
                        required
                        className="w-full mt-1 p-2 border rounded-md"
                        value={formData.siret}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="companyType"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Type entreprise
                    </label>
                    <select
                        id="companyType"
                        name="companyType"
                        required
                        className="w-full mt-1 p-2 border rounded-md"
                        value={formData.companyType}
                        onChange={handleInputChange}
                    >

                        <option value="Autoentrepreneur">Autoentrepreneur</option>
                        <option value="EI">Entreprise Individuelle (EI)</option>
                        <option value="EURL">Entreprise Unipersonnelle à Responsabilité Limitée (EURL)</option>
                        <option value="SARL">Société à Responsabilité Limitée (SARL)</option>
                        <option value="SA">Société Anonyme (SA)</option>
                        <option value="SAS">Société par Actions Simplifiée (SAS)</option>
                        <option value="SASU">Société par Actions Simplifiée Unipersonnelle (SASU)</option>
                        <option value="SNC">Société en Nom Collectif (SNC)</option>
                        <option value="Scop">Société Coopérative de Production (Scop)</option>
                        <option value="Association">Association</option>

                    </select>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="subjectToVat"
                        className="block text-sm font-medium text-gray-700"
                    >
                        <input
                            type="checkbox"
                            id="subjectToVat"
                            name="subjectToVat"
                            className="mr-2"
                            checked={formData.subjectToVat}
                            onChange={handleInputChange}
                        />
                        Assujetti TVA
                    </label>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="iban"
                        className="block text-sm font-medium text-gray-700"
                    >
                        IBAN
                    </label>
                    <input
                        id="iban"
                        name="iban"
                        required
                        className="w-full mt-1 p-2 border rounded-md"
                        value={formData.iban}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="bic"
                        className="block text-sm font-medium text-gray-700"
                    >
                        BIC
                    </label>
                    <input
                        id="bic"
                        name="bic"
                        required
                        className="w-full mt-1 p-2 border rounded-md"
                        value={formData.bic}
                        onChange={handleInputChange}
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 mx-auto block w-1/3 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Sauvegarder
                </button>
            </form>
        </div>
    )
}

export default TeacherPaymentInfoFormComponent
