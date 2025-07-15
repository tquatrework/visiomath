import {
    use{userStory1}Repository
} from "@src/features/{module}/{userStory1}/{userStory1}.repository.provider";

import { useState, useEffect } from "react";
import {
    {userStory1}QueryResult
} from "@src/features/{module}/{userStory1}/{userStory1}.queryResult";

export const useUserStory1Usecase = () => {

    const {userStory1}Repository = use{userStory1}Repository()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState<{userStory1}QueryResult | null>(null);

    const {userStory1}Query = async () => {
        if (!{userStory1}Repository) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await {userStory1}Repository.execute();
            setPaymentInfo(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Récupération des informations de paiement impossible.");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        {userStory1}Query();
    }, []);

    return { paymentInfo, loading, error};
}
