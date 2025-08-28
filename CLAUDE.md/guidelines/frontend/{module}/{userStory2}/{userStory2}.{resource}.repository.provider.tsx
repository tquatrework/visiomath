import {
    {userStory2}Repository
} from "@src/features/{module}/{userStory2}/{userStory2}.repository";
import {createContext, useContext} from "react";

export const {userStory2}RepositoryContext = createContext<{userStory2}Repository | null>(null)


export const {userStory2}RepositoryProvider: React.FC<{ children: React.ReactNode, {userStory2}Repository?: {userStory2}Repository }> = ({ children, {userStory2}Repository }) => {

    return (
        <{userStory2}RepositoryContext.Provider value={{userStory2}Repository || null}>
            {children}
        </{userStory2}RepositoryContext.Provider>
    );
};


export const useGet{userStory2}Repository = () => {

    const {userStory2}Repository = useContext({userStory2}RepositoryContext);


    return {userStory2}Repository;
}