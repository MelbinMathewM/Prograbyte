import express from "express";
import dotenv from "dotenv";
import router from "./routes/routes";

dotenv.config();

import { validateEnv } from "@/utils/validate-env.util";
import verifyApiKey from "@/configs/api-key.config";
import { env } from "@/configs/env.config";
import connectDB from "./configs/db.config";
import { errorHandler } from "./middlewares/error.middleware";

validateEnv();

connectDB();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verifyApiKey as express.RequestHandler);

app.use('/',router);

app.use(errorHandler);


const PORT = process.env.PORT || 5009;
app.listen(PORT, () => { console.log(`Blog service running on PORT ${PORT}`) })