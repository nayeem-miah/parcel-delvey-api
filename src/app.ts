import express, { Request, Response } from "express";
import cors from "cors"
import notFount from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))  // parse JSON
app.use(cors());

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