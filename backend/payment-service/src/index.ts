import express, { Application } from "express";
import dotenv from "dotenv";
import verifyApiKey from "@/configs/api-key.config";
import { validateEnv } from "@/utils/env-config.util";
import connectDB from "@/configs/db.config";

dotenv.config();

validateEnv();
connectDB();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verifyApiKey as express.RequestHandler);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});