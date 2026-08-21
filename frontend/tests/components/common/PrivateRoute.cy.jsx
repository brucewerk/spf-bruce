import React from "react";
import PrivateRoute from "../../../src/components/common/PrivateRoute";
import { mountWithProviders } from "../../support/component";

// Mock do usuário logado para forçar o PrivateRoute a renderizar os filhos
const mockUser = { name: "BruCe", email: "bruce@spf.com" };

// Simula o AuthContext com um usuário autenticado
const MockAuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        loading: false,
        login: () => {},
        register: () => {},
        logout: () => {},
        updateProfile: () => {},
        deleteAccount: () => {},
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

describe("<PrivateRoute />", () => {
  it("deve renderizar os filhos se o usuário estiver autenticado", () => {
    // 🔥 Usamos o MockAuthProvider para simular um usuário logado
    mountWithProviders(
      <MockAuthProvider>
        <PrivateRoute>
          <div>Conteúdo Protegido</div>
        </PrivateRoute>
      </MockAuthProvider>,
      { router: true },
    );

    cy.contains("Conteúdo Protegido").should("be.visible");
  });
});
