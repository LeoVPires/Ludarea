const express = require("express");
const cors = require("cors");
const authRoutes = require("./authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Usar as rotas de autenticação
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
