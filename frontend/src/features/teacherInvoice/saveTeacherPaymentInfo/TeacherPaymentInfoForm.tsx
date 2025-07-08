import React from 'react'
import {
    useSaveTeacherPaymentInfos,
} from '@src/features/teacherInvoice/saveTeacherPaymentInfo/useSaveTeacherPaymentInfo.usecase'
import {
    TeacherPaymentInfosModel,
} from '@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model'

function isTeacherPaymentInfosModel(obj: unknown): obj is TeacherPaymentInfosModel {
    if (typeof obj !== 'object' || obj === null) return false
    const o = obj as Record<string, unknown>

    return (
        typeof o.companyName === 'string' &&
        typeof o.siret === 'string' &&
        typeof o.companyType === 'string' &&
        typeof o.companyType === 'string' &&
        typeof o.vatExempt === 'boolean' &&
        typeof o.iban === 'string' &&
        typeof o.bic === 'string'
    )
}

const TeacherPaymentInfoForm = () => {
    const saveTeacherPaymentInfosUseCase = useSaveTeacherPaymentInfos()

    const saveTeacherPaymentInfo = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const fd = new FormData(event.currentTarget)
        const raw = {
            companyName: fd.get('companyName'),
            siret: fd.get('siret'),
            companyType: fd.get('companyType'),
            vatExempt: fd.get('vatExempt') === 'on',
            iban: fd.get('iban'),
            bic: fd.get('bic'),
        }

        if (!isTeacherPaymentInfosModel(raw)) {
            alert('Les informations de paiement du professeur ne sont pas au bon format')
            return
        }

        try {
            await saveTeacherPaymentInfosUseCase(raw)
            alert('Enregistrement Ok')
        } catch (err) {
            alert(err instanceof Error ? err.message
                : 'Une erreur est survenue')
        }
    }

    return (
        <div>
            <form
                className="p-6 bg-white shadow-md rounded-lg"
                onSubmit={saveTeacherPaymentInfo}
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
                        htmlFor="vatExempt"
                        className="block text-sm font-medium text-gray-700"
                    >
                        <input
                            type="checkbox"
                            id="vatExempt"
                            name="vatExempt"
                            className="mr-2"
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

export default TeacherPaymentInfoForm
