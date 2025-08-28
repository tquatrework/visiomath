import {
    use{userStory1}UseCase,
} from '@src/features/{module}/{userStory1}/use{userStory1}.usecase'

const UserStory1Component = () => {
    const { paymentInfo, loading, error } = use{userStory1}UseCase()

    if (loading) {
        return <div>Chargement...</div>
    }

    if (error) {
        return <div>Erreur: {error}</div>
    }

    if (!paymentInfo) {
        return <div>Aucune information de paiement trouvée</div>
    }

    return (
        <div>
            <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Mes informations de paiement
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Nom de l'entreprise
                    </label>
                    <div 
                        data-testid="company-name"
                        className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    >
                        {paymentInfo.companyName}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        SIRET
                    </label>
                    <div 
                        data-testid="siret"
                        className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    >
                        {paymentInfo.siret}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Type d'entreprise
                    </label>
                    <div 
                        data-testid="company-type"
                        className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    >
                        {paymentInfo.companyType}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Assujetti TVA
                    </label>
                    <div 
                        data-testid="vat-subject"
                        className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    >
                        {paymentInfo.vatSubject ? 'oui' : 'non'}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        IBAN
                    </label>
                    <div 
                        data-testid="iban"
                        className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    >
                        {paymentInfo.iban}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        BIC
                    </label>
                    <div 
                        data-testid="bic"
                        className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    >
                        {paymentInfo.bic}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserStory1Component
