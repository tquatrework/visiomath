import {
    {userStory1}Repository
} from "@src/features/{module}/{userStory1}/{userStory1}.repository";
import {createContext, useContext} from "react";

export const {userStory1}RepositoryContext = createContext<{userStory1}Repository | null>(null)

export const {userStory1}Provider: React.FC<{ children: React.ReactNode, {userStory1}Repository?: {userStory1}Repository }> = ({ children, {userStory1}Repository }) => {

    return (
        <{userStory1}RepositoryContext.Provider value={{userStory1}Repository || null}>
            {children}
        </{userStory1}RepositoryContext.Provider>
    );
};

export const use{userStory1}Repository = () => {

    const {userStory1}Repository = useContext({userStory1}RepositoryContext);
    if (!{userStory1}Repository) {
        throw new Error("{userStory1}Repository is not provided. Please wrap your component with {userStory1}Provider.");
    }

    return {userStory1}Repository;
}
