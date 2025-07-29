import {beforeEach, describe, expect, MockInstance, test, vi} from "vitest";
import TeacherPaymentInfoForm from "@src/features/{module}/{userStory2}/TeacherPaymentInfoForm";
import {render, waitFor, screen, act} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import {
    {userStory2}RepositoryProvider
} from "@src/features/{module}/{userStory2}/{userStory2}.repository.provider";
import {
    {userStory2}SuccessInMemoryRepository
} from "@src/features/{module}/{userStory2}/{userStory2}.successInMemoryRepository";
import {
    {userStory2}FailureInMemoryRepository
} from "@src/features/{module}/{userStory2}/{userStory2}.failureInMemoryRepository";


describe('#{userStory2ID}: {userStory2}', async () => {

    let alertSpy: MockInstance;

    beforeEach(() => {
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    test('#{scenarioID}: {scenarioName}', async () => {

        // Etant donné que je suis connecté en tant que xxxx
        act(() => {
            render(<{userStory2}RepositoryProvider
                {userStory2}Repository={new {userStory2}SuccessInMemoryRepository()}>
                <{UserStoryComponent}/>
            </{userStory2}RepositoryProvider>);
        });

        // Quand j'enregistre :
        // nomTest : "Dupont"
        await userEvent.type(screen.getByLabelText(/Nom test/i), 'Dupont')
        // prenomTest : "JeanPierre"
        await userEvent.type(screen.getByLabelText(/Prenom test/i), 'JeanPierre')

        await act(async () => {
            await userEvent.click(screen.getByRole('button', {name: /Sauvegarder/i}));
        });

        // Alors mon enregistrement doit être confirmé
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Enregistrement Ok')
        })

    })


})
