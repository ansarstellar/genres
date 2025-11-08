import express from "express";
import Joi from "joi";
const router = express.Router();

let genres = [
    { id: 1, name: "indie-pop" },
    { id: 2, name: "rock" },
    { id: 3, name: "amapiano" },
];

const genreSchema = Joi.object({
    name: Joi.string().trim().min(3).max(40).required(),
}).options({ abortEarly: false, allowUnknown: false });

function validateGenre(req, res, next) {
    const { error, value } = genreSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: "Invalid input",
            details: error.details.map((d) => d.message),
        });
    }
    req.validatedBody = value;
    next();
}

router.get("/", (_, res) => {
    res.json(genres);
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const genre = genres.find((g) => g.id === id);
    if (!genre)
        return res
            .status(404)
            .json({ error: "Genre with given ID not found." });
    res.json(genre);
});

router.post("/", validateGenre, (req, res) => {
    const exists = genres.some(
        (g) => g.name.toLowerCase() === req.validatedBody.name.toLowerCase()
    );
    if (exists) return res.status(400).json({ error: "Genre already exists." });
    const nextId =
        (genres.length ? Math.max(...genres.map((g) => g.id)) : 0) + 1;
    const genre = { id: nextId, name: req.validatedBody.name };
    genres.push(genre);
    res.status(201).location(`/api/genres/${genre.id}`).json(genre);
});

router.put("/:id", validateGenre, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const genre = genres.find((g) => g.id === id);
    if (!genre)
        return res
            .status(404)
            .json({ error: "Genre with given ID not found." });

    const exists = genres.some(
        (g) =>
            g.id !== id &&
            g.name.toLowerCase() === req.validatedBody.name.toLowerCase()
    );

    if (exists) return res.status(400).json({ error: "Genre already exists." });

    genre.name = req.validatedBody.name;
    res.json(genre);
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = genres.findIndex((g) => g.id === id);
    if (idx === -1)
        return res
            .status(404)
            .json({ error: "Genre with given ID not found." });
    const [deleted] = genres.splice(idx, 1);
    res.json(deleted);
});

export default router;
