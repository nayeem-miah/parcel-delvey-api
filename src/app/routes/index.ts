/* eslint-disable @typescript-eslint/no-explicit-any */

import { Router } from 'express';
import { UserRouter } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
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
];


modelerRouters.forEach((route) => {
    router.use(route.path, route.route)
})