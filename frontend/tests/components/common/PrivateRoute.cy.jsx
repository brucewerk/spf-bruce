import React from "react";
import { BrowserRouter } from "react-router-dom";
import PrivateRoute from "../../../src/components/common/PrivateRoute";
import { AuthContext } from "../../../src/context/AuthContext";

// Mock do usuário logado
const mockUser = { name: "BruCe", email: "bruce@spf.com" };

// Provider que simula o AuthContext com usuário logado
const MockAuthProvider = ({ children }) => {
  const mockValue = {
    user: mockUser,
    loading: false,
    login: () => {},
    register: () => {},
    logout: () => {},
    updateProfile: () => {},
    deleteAccount: () => {},
    isAuthenticated: true,
  };

  return (
    <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
  );
};

describe("<PrivateRoute />", () => {
  it("deve renderizar os filhos se o usuário estiver autenticado", () => {
    cy.mount(
      <BrowserRouter>
        <MockAuthProvider>
          <PrivateRoute>
            <div>Conteúdo Protegido</div>
          </PrivateRoute>
        </MockAuthProvider>
      </BrowserRouter>,
    );

    cy.contains("Conteúdo Protegido").should("be.visible");
  });

  it("deve redirecionar para /login se o usuário não estiver autenticado", () => {
    // Provider que simula o AuthContext SEM usuário logado
    const MockAuthProviderSemUsuario = ({ children }) => {
      const mockValue = {
        user: null,
        loading: false,
        login: () => {},
        register: () => {},
        logout: () => {},
        updateProfile: () => {},
        deleteAccount: () => {},
        isAuthenticated: false,
      };

      return (
        <AuthContext.Provider value={mockValue}>
          {children}
        </AuthContext.Provider>
      );
    };

    cy.mount(
      <BrowserRouter>
        <MockAuthProviderSemUsuario>
          <PrivateRoute>
            <div>Conteúdo Protegido</div>
          </PrivateRoute>
        </MockAuthProviderSemUsuario>
      </BrowserRouter>,
    );

    // O PrivateRoute redireciona para /login, então o conteúdo não deve aparecer
    cy.contains("Conteúdo Protegido").should("not.exist");
  });
});
