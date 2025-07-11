import {
    useGet{userStory2}Repository
} from "@src/features/{module}/{userStory2}/{userStory2}.repository.provider";
import { useState } from "react";

export type {UserStory2}Command = {
    companyName: string;
    siret: string;
    companyType: string;
    vatExempt: boolean;
    iban: string;
    bic: string;
}

export const use{userStory2}UseCase = () => {

    const {userStory2}Repository = useGet{userStory2}Repository()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {userStory2}sCommandHandler = async ({userStory2}Command: {UserStory2}Command) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            await {userStory2}Repository.execute({userStory2}Command);
            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Enregistrement des informations de paiement impossible.");
            }
        } finally {
            setLoading(false);
        }
    }

    return { {userStory2}sCommandHandler, loading, error, success };

}
