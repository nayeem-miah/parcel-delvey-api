import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelValidation } from "./parcel.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";

const router = Router();

router.post("/",
    validateRequest(createParcelValidation),
    checkAuth(Role.SENDER, Role.ADMIN),
    ParcelController.createParcel
);

router.patch("/cancel/:id",
    checkAuth(Role.SENDER),
    ParcelController.cancelParcel
);

router.get("/me",
    checkAuth(Role.SENDER),
    ParcelController.allParcel
);





export const ParcelRoute = router