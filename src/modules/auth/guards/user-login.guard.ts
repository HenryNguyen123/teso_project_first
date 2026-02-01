import { CanActivate, ExecutionContext, Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { emailRegex } from "src/shared/utils/regex.util";
import { Repository } from "typeorm";
import { User } from "src/database/entities/user.entity";

@Injectable()
export class UserLoginGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        const email = body.email;
        const password = body.password;
        if (!email || !password) {
            throw new UnauthorizedException('Email or password is required');
        }
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Invalid email format');
        }
        const user = await this.usersRepository.findOne({ where: { email }, relations: { role: true }    });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        if (user.role.code !== process.env.USER_ROLE_CODE) {
            throw new UnauthorizedException('User is not authorized to login');
        }
        return true;
    }
}