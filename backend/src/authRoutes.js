const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./db"); // Conexão com o PostgreSQL
const jwt = require("jsonwebtoken"); // Para gerar tokens de autenticação

const router = express.Router();

// Rota de Registro
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifica se o usuário já existe
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Usuário já existe" });
    }
    // Hasheia a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Insere o novo usuário no banco de dados
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao registrar usuário", error: error.message });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    // Verifica se a senha está correta
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Gera um token JWT
    const token = jwt.sign({ id: user.rows[0].id }, "seu-segredo-jwt", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
});

module.exports = router;
