import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialLogin)

router.post("/logout", AuthController.logout)


export const AuthRoutes = router;