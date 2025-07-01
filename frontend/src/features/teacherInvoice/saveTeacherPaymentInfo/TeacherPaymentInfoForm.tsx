import {
    useSaveTeacherPaymentInfos
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/useSaveTeacherPaymentInfo.usecase";
import {
    TeacherPaymentInfosModel
} from "@src/features/teacherInvoice/saveTeacherPaymentInfo/saveTeacherPaymentInfo.model";


function isTeacherPaymentInfosModel(
    obj: unknown,
): obj is TeacherPaymentInfosModel {
    if (typeof obj !== 'object' || obj === null) return false
    const o = obj as Record<string, unknown>

    return (
        typeof o.companyName === 'string' &&
        typeof o.siret === 'string' &&
        typeof o.businessType === 'string' &&
        ['AE', 'SARL', 'SA'].includes(o.businessType) &&
        typeof o.vatExempted === 'boolean' &&
        typeof o.iban === 'string' &&
        typeof o.bic === 'string'
    )
}


const TeacherPaymentInfoForm = () => {

    const saveTeacherPaymentInfosUseCase = useSaveTeacherPaymentInfos();

    const saveTeacherPaymentInfo = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const saveTeacherPaymentInfos = {
            companyName: formData.get('companyName'),
            siret: formData.get('siret'),
            businessType: formData.get('businessType'),
            vatExempted: formData.get('vatExempted') === 'on',
            iban: formData.get('iban'),
            bic: formData.get('bic'),
        }

        if (!isTeacherPaymentInfosModel(saveTeacherPaymentInfos)) {
            console.log('hello ?')
            alert('Les informations de paiement du professeur ne sont pas au bon format');
            return;
        }

        try {
            await saveTeacherPaymentInfosUseCase(saveTeacherPaymentInfos);
            alert('Enregistrement Ok');
        } catch (error) {

            if (error instanceof Error) {
                alert(error.message);
                return;
            }
            alert("Une erreur s'est produite lors de l'enregistrement des informations de paiement du professeur.");
        }

    };

    return (
        <div>
            <h2>Teacher Payment Information</h2>

            <form onSubmit={saveTeacherPaymentInfo}>
                <div>
                    <label htmlFor="companyName">Nom de l'entreprise</label>
                    <input type="text" id="companyName" name="companyName" required />
                </div>

                <div>
                    <label htmlFor="siret">Siret</label>
                    <input type="text" id="siret" name="siret" required />
                </div>

                <div>
                    <label htmlFor="businessType">Type entreprise</label>
                    <select id="businessType" name="businessType" required>
                        <option value="AE">Auto-entrepreneur</option>
                        <option value="SARL">SARL</option>
                        <option value="SA">SA</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div>
                    <label htmlFor="vatExempted">
                        Assujetti TVA
                        <input type="checkbox" id="vatExempted" name="vatExempted" />
                    </label>
                </div>

                <div>
                    <label htmlFor="iban">IBAN</label>
                    <input type="text" id="iban" name="iban" required />
                </div>

                <div>
                    <label htmlFor="bic">BIC</label>
                    <input type="text" id="bic" name="bic" required />
                </div>

                <button type="submit">Enregistrer</button>
            </form>

        </div>
    );
}

export default TeacherPaymentInfoForm;