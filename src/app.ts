import express, { Request, Response } from "express";
import cors from "cors"
import notFount from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";




const app = express();

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
        "https://parcel-delevary-client.vercel.app"
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

/**
 * project modular mvc pattern 
 * todo 1 : create user (role base by default ---> sender or receiver)
 * todo 2 : manually admin create
 * todo 3 : create parcel--> admin role and sender role
 */