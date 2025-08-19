import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelValidation } from "./parcel.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";

const router = Router();

//  sender route
router.post("/",
    validateRequest(createParcelValidation),
    checkAuth(Role.SENDER, Role.ADMIN),
    ParcelController.createParcel
);

router.patch("/cancel/:id",
    checkAuth(Role.SENDER, Role.ADMIN),
    ParcelController.cancelParcel
);

router.get("/me",
    checkAuth(Role.SENDER),
    ParcelController.allParcel
);

//  admin route
router.get("/all",
    checkAuth(Role.ADMIN),
    ParcelController.getAllParcelByAdmin
)

router.patch("/blocked/:id",
    checkAuth(Role.ADMIN),
    ParcelController.updateIsBlocked
);

router.patch("/current-status/:id",
    checkAuth(Role.ADMIN),
    ParcelController.updateCurrentStatus
);

//  receiver route
router.get("/incoming",
    checkAuth(Role.RECEIVER),
    ParcelController.incomingParcel

)

router.patch("/confirm-status/:id",
    checkAuth(Role.RECEIVER),
    ParcelController.confirmCurrentStatus
)

router.get("/history",
    checkAuth(Role.RECEIVER),
    ParcelController.deliveryHistory
)



export const ParcelRoute = router