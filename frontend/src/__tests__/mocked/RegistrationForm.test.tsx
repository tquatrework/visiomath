 

vi.mock("../../services/authService", () => ({
  checkUsernameAvailability: vi.fn(() => Promise.resolve(true)), // Mock de la vérification du pseudo
}));

vi.mock("../../config/api.config", () => ({
  default: "http://mock-api-url",
}));


const createUserRelationsMock = vi.fn(() => Promise.resolve(true));
global.fetch = vi.fn(async (...args) => {
  console.log("🔹 Mock fetch appelé avec :", args);

  const response = {
    ok: true, 
    json: async () => ({
      user: { id: 1, role: "teacher", pseudo: "JohnDoe" },
      token: "mockToken",
    }),
  };

  // 🔥 Attendre la mise à jour du state avant de re-mocker
   await waitFor(() => {
    vi.doMock("../../services/registrationService", () => ({
      createUserRelations: createUserRelationsMock,
    }));
    console.log("✅ Mock de createUserRelations réappliqué après fetch");
  });

  return response;
});

// 🔹 Remplacement de la vraie fonction par le mock
vi.mock("../../features/auth/components/RegistrationForm", async () => {
  const actual = await vi.importActual("../../features/auth/components/RegistrationForm");
  return {
    ...actual,
    handleSubmit: vi.fn(() => Promise.resolve()), // Mock global de handleSubmit
  };
});



import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import { describe, test, vi, expect } from "vitest";
import { RegistrationForm } from "../../features/auth/components/RegistrationForm";
//import { handleSubmit } from "../../features/auth/components/RegistrationForm";
import * as UserContext from "../../providers/UserContext";
import * as RegistrationFormModule from "../../features/auth/components/RegistrationForm";



// Espionner handleSubmit après l'import
//const mockHandleSubmit = vi.spyOn(handleSubmit, "apply");


describe("RegistrationForm", () => {
  test("should create a new user with role 'teacher'", async () => {
    const mockOnReset = vi.fn();

    // 🛠️ 1️⃣ Spy sur `console.log` pour vérifier l'appel interne à handleSubmit
    const logSpy = vi.spyOn(console, "log");

    // Spy sur handleSubmit
      // 🛠️ On surveille handleSubmit dans RegistrationFormModule
  const mockHandleSubmit = vi.spyOn(RegistrationFormModule, "handleSubmit").mockImplementation(() => {
    console.log("🔥 handleSubmit MOCKÉ a été appelé !");
    return Promise.resolve();
  });


    render(<RegistrationForm onReset= {mockOnReset} />);

    // Étape 1 : Email et mot de passe
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "teacher@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/suivant/i));

    // Étape 2 : Prénom, nom et pseudo
    fireEvent.change(screen.getByRole("textbox", { name: /prénom/i }), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Nom"), { target: { value: "Doe" } });
    //fireEvent.change(screen.getByRole("textbox", { name: /nom/i }), {
    //  target: { value: "Doe" },
    //});
    fireEvent.change(screen.getByRole("textbox", { name: /pseudo/i }), {
      target: { value: "John Doe" },
    });

    console.log("Avant clic sur Suivant");
    fireEvent.click(screen.getByText(/suivant/i));
    await waitFor(() => {
      screen.debug(); // Affichera le DOM mis à jour
    });
    console.log("Après clic sur Suivant");

    // Étape 3 : Téléphone, rôle et compte actif
/*     fireEvent.change(screen.getByLabelText("Numéro de téléphone"), {
      target: { value: "1234567890" },
    }); */
    fireEvent.change(screen.getByRole("textbox", { name: /Numéro de téléphone/i }), {
      target: { value: "1234567890" },
    });

    fireEvent.change(screen.getByRole("combobox", { name: /rôle/i }), {
      target: { value: "teacher" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /compte actif/i })); // Cochez le compte actif

    // Soumettre
    fireEvent.click(screen.getByRole("button", { name: /créer le compte/i }));
    
    // 🛠️ 5️⃣ Vérifier qu'une ligne de log liée à handleSubmit a été appelée
    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringMatching(/handleSubmit appelé/),
        expect.any(Object) // ou un objet plus précis correspondant à `user`
      );
    });
    
    // Nettoyage des mocks
    logSpy.mockRestore();
    
    // Vérifier que la fonction onReset a été appelée
    //expect(mockOnReset).toHaveBeenCalled();
  });
});
