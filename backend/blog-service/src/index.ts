import express from "express";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5009;
app.listen(PORT, () => { console.log(`Blog service running on PORT ${PORT}`) })