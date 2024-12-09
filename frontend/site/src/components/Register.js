import React, { useState } from "react";
import "../App.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (!name || !email || !password) {
      setError("Todos os campos devem ser preenchidos");
      return;
    }

    // Enviar uma solicitação POST para o backend
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "/login"; // Redireciona para a página de login
      } else {
        setError(data.message || "Erro ao registrar usuário");
      }
    } catch (error) {
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2>Registro</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirme a Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          disabled={!name || !email || password !== confirmPassword}
        >
          Registrar
        </button>
        <p>
          Já possui uma conta? <a href="/login">Faça login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
