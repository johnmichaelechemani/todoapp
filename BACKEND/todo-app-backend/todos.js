const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.userId = decoded.id;
    next();
  });
};

router.get("/todos", verifyToken, (req, res) => {
  console.log("User ID from Token:", req.userId);

  db.query(
    "SELECT * FROM todos WHERE user_id = ?",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      console.log("Todos from DB:", results);
      res.json(results);
    }
  );
});

router.post("/todos", verifyToken, (req, res) => {
  const { task, description } = req.body;
  db.query(
    "INSERT INTO todos (task, user_id, description, completed) VALUES (?, ?, ?, ?)",
    [task, req.userId, description, false],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task added" });
    }
  );
});

router.delete("/todos/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [id, req.userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task deleted" });
    }
  );
});

router.put("/todos/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.query(
    "UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?",
    [completed, id, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Task not found or unauthorized" });
      }
      res.json({ message: "Task updated successfully" });
    }
  );
});

module.exports = router;
