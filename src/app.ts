import express, { Request, Response } from "express";
import cors from "cors"


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))  // parse JSON
app.use(cors());




app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to parcel delivery backend"
    })
});

// global error

// not fount page

export default app;