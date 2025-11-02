import express from "express";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

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

app.get("/", (_, res) => {
    res.json({ message: "Welcome to Genres API!" });
});

app.get("/api/genres", (_, res) => {
    res.json(genres);
});

app.get("/api/genres/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const genre = genres.find((g) => g.id === id);
    if (!genre)
        return res
            .status(404)
            .json({ error: "Genre with given ID not found." });
    res.json(genre);
});

app.post("/api/genres", validateGenre, (req, res) => {
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

app.put("/api/genres/:id", validateGenre, (req, res) => {
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

app.delete("/api/genres/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const idx = genres.findIndex((g) => g.id === id);
    if (idx === -1)
        return res
            .status(404)
            .json({ error: "Genre with given ID not found." });
    const [deleted] = genres.splice(idx, 1);
    res.json(deleted);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
});
