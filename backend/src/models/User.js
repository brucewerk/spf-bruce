const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Incrementado no logout (ou troca de senha) para invalidar, no servidor,
  // qualquer JWT emitido antes disso — sem isso, um token continuava válido
  // por até 7 dias mesmo depois do usuário clicar em "Sair".
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

// Hash password antes de salvar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updatedAt = Date.now();
    // Trocar a senha também deve derrubar sessões antigas.
    if (!this.isNew) {
      this.tokenVersion = (this.tokenVersion || 0) + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senha
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
