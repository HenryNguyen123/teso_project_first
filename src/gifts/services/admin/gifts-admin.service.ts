import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { CreateGiftDto } from 'src/gifts/dtos/request/create-gift-dto.dto';
import { User } from 'src/users/entities/user.entity';
import { deleteFile } from 'src/common/utils/delete-file.util';
import { UpdateGiftStatusDto } from 'src/gifts/dtos/request/update-gift-status.dto';
import { plainToInstance } from 'class-transformer';
import { GiftPaginationResponseDto } from 'src/gifts/dtos/response/gift-pagination-response-dto.dto';
import { GiftItemResponseDto } from 'src/gifts/dtos/response/get-all-gifts-response.dto';
import { UpdateGiftDto } from 'src/gifts/dtos/request/update-gift-dto.dto';
import { PaginationDto } from 'src/gifts/dtos/response/pagination.dto';

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
  async getAllGifts(query: PaginationDto) {
    try {
      const { page = 1, limit = 10 } = query;
      const [allGifts, total] = await this.giftRepository.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        relations: {
          userGifts: true,
        },
        take: limit,
        skip: (page - 1) * limit,
      });
      return plainToInstance(GiftPaginationResponseDto, {
        data: allGifts,
        meta: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
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
      });
      if (!gift) throw new NotFoundException('gift not found');
      return plainToInstance(GiftItemResponseDto, gift, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //step: create gift
  async createGift(body: CreateGiftDto, file: Express.Multer.File) {
    try {
      let image: string | undefined;
      const quantity = Number(body.quantity ?? 0);
      //step: validate
      if (quantity < 0) throw new BadRequestException('Quantity must be >= 0');
      if (file) {
        image = `/img/gifts/${file.filename}`;
      }
      //step: create gift
      const payload = {
        name: body.name.trim(),
        description: body.description,
        image: image,
        quantity: quantity,
        isActive: Boolean(body.isActive),
      };
      const gift = await this.giftRepository.save(payload);
      return plainToInstance(GiftItemResponseDto, gift);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //step: update gift by id
  async updateGiftById(
    id: number,
    body: UpdateGiftDto,
    file: Express.Multer.File,
  ) {
    try {
      let image: string | undefined;
      //step: validate
      if (body.quantity !== undefined && Number(body.quantity) < 0)
        throw new BadRequestException('Quantity must be >= 0');
      if (file) {
        image = `/img/gifts/${file.filename}`;
      }
      //step: create user gift
      const systemGift = await this.giftRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!systemGift) throw new NotFoundException('gift not found');
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
      return plainToInstance(GiftItemResponseDto, gift);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //step: update status gift
  async updateStatusGift(id: number, body: UpdateGiftStatusDto) {
    try {
      //step: update gift
      const result = await this.giftRepository.update(id, {
        isActive: body.isActive,
      });
      if (!result.affected) throw new NotFoundException('gift not found');
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
      return plainToInstance(GiftItemResponseDto, gift);
    } catch (error) {
      console.log(error);
      throw error;
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
      if (!systemGift) throw new NotFoundException('gift not found');
      //step: remove image
      if (systemGift.image) {
        deleteFile(systemGift.image);
      }
      //step: delete gift
      await this.giftRepository.remove(systemGift);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
