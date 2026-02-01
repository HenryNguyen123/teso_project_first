import { CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import { emailRegex } from "src/shared/utils/regex.util";

@Injectable()
export class AuthLoginGuard implements CanActivate {
    constructor() { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const email = body.email;
        const password = body.password;
        if (!email || !password) {
            return false;
        }
        if (!emailRegex.test(email)) {
            return false;
        }
        return true;
    }
}
