import express from "express";
const router = express.Router();

router.get("/", (_, res) => {
    res.json({ message: "Welcome to Genres API!" });
});

export default router;
