import { Request, Response, Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.credentialLogin)

router.post("/logout", AuthController.logout);


//  google login
router.get("/google", async (req: Request, res: Response) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res)
})

// callback 
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthController.googleCallbackControllers)


export const AuthRoutes = router;