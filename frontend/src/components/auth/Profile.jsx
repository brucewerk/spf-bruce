import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Trash2, User, Mail, Key } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);
    const updateData = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
    }

    const result = await updateProfile(updateData);
    setLoading(false);

    if (result.success) {
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const result = await deleteAccount(formData.currentPassword || "");
    setLoading(false);
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      <div className="card space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <User className="w-4 h-4 inline mr-2" />
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="font-medium mb-3">
              <Key className="w-4 h-4 inline mr-2" />
              Alterar senha
            </h3>

            <div className="space-y-3">
              <div>
                <label className="label">Senha atual</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label">Nova senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label">Confirmar nova senha</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                {showPassword ? "Ocultar senhas" : "Mostrar senhas"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button onClick={logout} className="btn-secondary w-full">
            Sair da conta
          </button>
        </div>

        <div className="border-t border-red-200 dark:border-red-800 pt-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Deletar conta
          </button>
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
              Deletar conta
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tem certeza? Esta ação é irreversível e todos os seus dados serão
              perdidos.
            </p>
            <div className="mb-4">
              <label className="label">Confirme sua senha</label>
              <input
                type="password"
                value={formData.currentPassword || ""}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex-1"
              >
                {loading ? "Deletando..." : "Confirmar exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
