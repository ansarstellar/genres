import express from "express";
import dotenv from "dotenv";
import genres from "./routes/genres.js";
import home from "./routes/home.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/genres", genres);
app.use("/", home);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
});
