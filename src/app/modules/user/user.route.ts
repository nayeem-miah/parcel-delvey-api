import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";



const router = Router();

router.post("/register",
    validateRequest(createUserZodSchema),
    UserController.createUser
);
router.get("/me",
    checkAuth(...Object.values(Role)),
    UserController.userProfile
);

router.get("/all-user",
    checkAuth(Role.ADMIN),
    UserController.allUser
)
router.get("/:id",
    checkAuth(Role.ADMIN),
    UserController.singleUser
)



export const UserRouter = router;