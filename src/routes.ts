import { AuthController } from "./controller/auth.controller";
import { UserController } from "./controller/user.controller";

export const Routes = [
    {
        method: "post",
        route: "/auth/login",
        controller: AuthController,
        action: "login"
    }, {
        method: "post",
        route: "/auth/signup",
        controller: AuthController,
        action: "signup"
    }, {
        method: "get",
        route: "/auth/verify/:signature",
        controller: AuthController,
        action: "verify"
    }, {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "index"
    }, {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "create"
    }, {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "read"
    }, {
        method: "put",
        route: "/users/:id",
        controller: UserController,
        action: "update"
    }, {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "delete"
    }];