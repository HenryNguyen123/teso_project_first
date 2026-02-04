import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddUserDto } from 'src/users/dtos/reques/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  comparePassword,
  hashPassword,
} from 'src/common/utils/hash-password.util';
import { Role } from 'src/auth/entities/role.entity';
import { Request } from 'express';
import { IPayloadLogin } from 'src/auth/interfaces/login.interface';
import { UpdateUserDto } from 'src/users/dtos/reques/update-user-dto.dto';
import { avatarPath } from 'src/common/utils/upload-avatar.util';
import { deleteFile } from 'src/common/utils/delete-file.util';
import { ChangePasswordDto } from 'src/users/dtos/reques/change-password-dto.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/users/dtos/response/user-response.dto';
type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}
  //step 1: create user
  async create(body: CreateAddUserDto, file: Express.Multer.File | null) {
    const avatar = file ? avatarPath(file) : undefined;
    const password = body.password.trim();
    const email = body.email.trim();
    const userCode = 'USER';
    //step: check email exist
    const checkEmail = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (checkEmail) throw new BadRequestException('Email already exists');
    //step: hash password
    const hash = await hashPassword(password);
    //step: check role
    const role = await this.RoleRepository.findOne({
      where: {
        code: userCode,
      },
    });
    if (!role) throw new BadRequestException('Role not found');
    //step create user
    const payload = {
      email: email,
      // password: hash,
      fullName: body.fullName,
      dob: body.dob ? new Date(body.dob) : undefined,
      gender: body.gender ?? undefined,
      avatar: avatar ? `/img/avatar/${avatar}` : undefined,
      role: role,
      created_at: new Date(),
    };
    const user = this.usersRepository.create({ ...payload, password: hash });
    const checkCreateUser = await this.usersRepository.save(user);
    if (checkCreateUser) {
      return plainToInstance(UserResponseDto, checkCreateUser);
    }
    throw new InternalServerErrorException('create user fail');
  }
  // step 5: get me
  async me(req: Request) {
    const getUser = req.user as IPayloadLogin;
    if (!getUser) throw new BadRequestException('User not found');
    const email = getUser.email;
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return plainToInstance(UserResponseDto, user);
  }
  //step 6: update me
  async updateMe(
    req: Request,
    body: UpdateUserDto,
    file: Express.Multer.File | null,
  ) {
    const getUser = req.user as IPayloadLogin;
    if (!getUser) throw new BadRequestException('User not found');
    const email = getUser.email;
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    // step:save update user
    if (body.fullName !== undefined) {
      const name = body.fullName.trim();
      if (name.length > 0) {
        user.fullName = name;
      }
    }
    if (body.dob !== undefined && body.dob !== null) {
      const dobStr = String(body.dob);
      const dob = new Date(dobStr);
      if (isNaN(dob.getTime()))
        throw new BadRequestException('Invalid dob format');
      user.dob = dob;
    }
    if (body.gender !== undefined) {
      user.gender = body.gender as GenderType;
    }
    //step: update avatar
    if (file) {
      if (user.avatar) {
        deleteFile(user.avatar);
      }
      user.avatar = avatarPath(file);
    }
    await this.usersRepository.save(user);
    const updatedUser = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        role: true,
      },
    });
    return plainToInstance(UserResponseDto, updatedUser);
  }
  //step 7: change password
  async changePassword(req: Request, body: ChangePasswordDto) {
    //step: validate
    const getUser = req.user as IPayloadLogin;
    if (!getUser) throw new NotFoundException('User not found');
    const password = body.newPassword.trim();
    const email = getUser.email;
    if (body.oldPassword === password)
      throw new BadRequestException(
        'New password must be different from old password',
      );
    //step: check user
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) throw new NotFoundException('User not found');
    //step: check old password
    const checkPassword = await comparePassword(
      body.oldPassword,
      user.password,
    );
    if (!checkPassword)
      throw new BadRequestException('Old password is incorrect');
    //step: hash new password
    const hash = await hashPassword(password);
    user.password = hash;
    await this.usersRepository.save(user);
    const updateUser = await this.usersRepository.findOne({
      where: {
        email: email,
      },
      relations: {
        role: true,
      },
    });
    return plainToInstance(UserResponseDto, updateUser);
  }
}
