const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth");
const todosRoutes = require("./todos"); 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", todosRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
