import React, { useState } from "react";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    // Enviar uma solicitação POST para o backend
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        alert("Logado com sucesso!");
        window.location.href = "/home"; // Redireciona para a página principal (modifique conforme necessário)
      } else {
        setError(data.message || "Erro ao fazer login");
      }
    } catch (error) {
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
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
        <button onClick={handleLogin}>Login</button>
        <p>
          Ainda não possui uma conta? <a href="/register">Registre-se</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
