import express from "express";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const genres = [
    {
        id: 1,
        name: "indie-pop",
    },
    {
        id: 2,
        name: "rock",
    },
    {
        id: 3,
        name: "amapiano",
    },
];
app.get("/", (req, res) => {
    res.send("Welcome to Genres API!");
});

app.get("/api/genres", (req, res) => {
    res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id, 10));
    if (!genre) return res.status(404).send("Genre with given ID not found.");
    res.send(genre);
});

app.post("/api/genres", (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send("Invalid input.");

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    };

    genres.push(genre);
    res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id, 10));
    if (!genre) return res.status(404).send("Genre with given ID not found.");

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send("Invalid input.");

    genre.name = req.body.name;
    res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
    const genre = genres.find((g) => g.id === parseInt(req.params.id, 10));
    if (!genre) return res.status(404).send("Genre with given ID not found.");

    const index = genres.indexOf(genre);
    if (index > -1) {
        genres.splice(index, 1);
    }
    res.send(genre);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
});

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return schema.validate(genre);
}
