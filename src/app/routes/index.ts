/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ParcelRoute } from '../modules/parcel/parcel.route';
export const router = Router();

interface IModule {
    path: string;
    route: any;
}

const modelerRouters: IModule[] = [
    {
        path: "/user",
        route: UserRouter
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/parcels",
        route: ParcelRoute
    },
];


modelerRouters.forEach((route) => {
    router.use(route.path, route.route)
})