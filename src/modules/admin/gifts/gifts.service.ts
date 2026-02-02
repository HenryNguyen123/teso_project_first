import { Injectable } from '@nestjs/common';
import { GiftPaginationDto } from 'src/modules/admin/gifts/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { responseError, responseSuccess } from 'src/shared/utils/response.util';
import { SystemGift } from 'src/database/entities/system-gift.entity';
import { UserGift } from 'src/database/entities/user-gift.entity';
import { CreateGiftDto } from 'src/modules/admin/gifts/dtos/createGiftDto.dto';
import { Request } from 'express';
import { User } from 'src/database/entities/user.entity';
import { deleteFile } from 'src/shared/utils/deleteFile.util';
import { UpdateGiftStatusDto } from 'src/modules/admin/gifts/dtos/updateStatus.dto';

@Injectable()
export class AdminGiftsService {
  constructor(
    @InjectRepository(User)
    private adminRepository: Repository<User>,
    @InjectRepository(SystemGift)
    private giftRepository: Repository<SystemGift>,
    @InjectRepository(UserGift)
    private userGiftRepository: Repository<UserGift>,
  ) {}
  //step: get all gifts
  async getAllGifts(query: GiftPaginationDto) {
    try {
      const { page = 1, limit = 10 } = query;
      const [allGifts, total] = await this.giftRepository.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        select: [
          'id',
          'name',
          'description',
          'image',
          'quantity',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
        relations: {
          userGifts: true,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
      //step: pagination
      const payload = {
        data: allGifts,
        meta: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      };
      return responseSuccess('get all gifts successfully', 0, payload);
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: get gift by id
  async getGiftById(id: number) {
    try {
      const gift = await this.giftRepository.findOne({
        where: {
          id,
        },
        relations: {
          userGifts: true,
        },
        select: [
          'id',
          'name',
          'description',
          'image',
          'quantity',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!gift) return responseError('get gift by id fail', 1010);
      return responseSuccess('get gift by id successfully', 0, gift);
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: create gift
  async createGift(body: CreateGiftDto, file: Express.Multer.File) {
    try {
      let image: string | undefined;
      //step: validate
      if (!body.name?.trim())
        return responseError('Gift name is required', 1001);
      if (Number(body.quantity) < 0)
        return responseError('Quantity must be >= 0', 1002);
      if (file) {
        image = file.filename;
      }
      //step: create gift
      const payload = {
        name: body.name,
        description: body.description,
        image: image,
        quantity: Number(body.quantity),
        isActive: Boolean(body.isActive),
      };
      const gift = await this.giftRepository.save(payload);
      if (!gift) return responseError('create gift fail', 1011);
      return responseSuccess('create gift successfully', 0, gift);
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: update gift by id
  async updateGiftById(
    id: number,
    body: CreateGiftDto,
    file: Express.Multer.File,
  ) {
    try {
      let image: string | undefined;
      //step: validate
      if (!body.name?.trim())
        return responseError('Gift name is required', 1001);
      if (body.quantity !== undefined && Number(body.quantity) < 0)
        return responseError('Quantity must be >= 0', 1002);
      if (file) {
        image = file.filename;
      }
      //step: create user gift
      const systemGift = await this.giftRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!systemGift) return responseError('gift not found', 1013);
      //step: remove old image
      if (file && systemGift.image) {
        deleteFile(systemGift.image);
      }
      //step: create gift
      const payload = {
        name: body.name ?? systemGift.name,
        description: body.description ?? systemGift.description,
        image: image ?? systemGift.image,
        quantity:
          body.quantity !== undefined
            ? Number(body.quantity)
            : systemGift.quantity,
        isActive:
          body.isActive !== undefined ? body.isActive : systemGift.isActive,
      };
      const gift = await this.giftRepository.save({
        ...systemGift,
        ...payload,
      });
      if (!gift) return responseError('create gift fail', 1011);
      return responseSuccess('create gift successfully', 0, gift);
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: update status gift
  async updateStatusGift(id: number, body: UpdateGiftStatusDto) {
    try {
      //step: validate
      if (!body || body.isActive === undefined)
        return responseError('Status is required', 1001);
      const isActive = body.isActive as boolean | string;
      if (isActive === 'true') body.isActive = true;
      if (isActive === 'false') body.isActive = false;
      //step: update gift
      const result = await this.giftRepository.update(id, {
        isActive: body.isActive,
      });
      if (!result.affected) return responseError('gift not found', 1013);
      //step: get gift
      const gift = await this.giftRepository.findOne({
        where: {
          id,
        },
        select: [
          'id',
          'name',
          'description',
          'image',
          'quantity',
          'isActive',
          'createdAt',
          'updatedAt',
        ],
      });
      return responseSuccess('update status gift successfully', 0, gift);
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: delete gift
  async deleteGift(id: number) {
    try {
      //step: create user gift
      const systemGift = await this.giftRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!systemGift) return responseError('gift not found', 1013);
      //step: remove image
      if (systemGift.image) {
        deleteFile(systemGift.image);
      }
      //step: delete gift
      await this.giftRepository.remove(systemGift);
      return responseSuccess('delete gift successfully', 0, true);
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
}
