import express, { Request, Response } from "express";
import cors from "cors"
import notFount from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import "./app/config/passport"




const app = express();
app.set("trust proxy", 1);


// passport
app.use(expressSession({
    secret: envVars.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false
}))



app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://parcel-delevary-client.vercel.app",
        "https://parcel-delvey-api.vercel.app",
        envVars.FRONTEND_URL
    ],
    credentials: true
}
));

// router 
app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        timestamp: new Date().toString(),
        message: "Welcome to parcel delivery backend"
    })
});

// global error
app.use(globalErrorHandler);
// not fount page
app.use(notFount);

export default app;
