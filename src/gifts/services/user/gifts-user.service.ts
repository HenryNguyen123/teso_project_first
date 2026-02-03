import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from 'src/gifts/dtos/response/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { SystemGift } from 'src/gifts/entities/system-gift.entity';
import { UserGift } from 'src/gifts/entities/user-gift.entity';
import { plainToInstance } from 'class-transformer';
import { GiftPaginationResponseDto } from 'src/gifts/dtos/response/gift-pagination-response-dto.dto';
import { GiftItemResponseDto } from 'src/gifts/dtos/response/get-all-gifts-response.dto';

@Injectable()
export class GiftsService {
  constructor(
    @InjectRepository(SystemGift)
    private giftRepository: Repository<SystemGift>,
    @InjectRepository(UserGift)
    private giftTypeRepository: Repository<UserGift>,
  ) {}
  //step: get all gifts
  async getAllGifts(paginationDto: PaginationDto) {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const [allGifts, total] = await this.giftRepository.findAndCount({
        where: {
          isActive: true,
          quantity: MoreThan(0),
        },
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
        skip: (page - 1) * limit,
        take: limit,
      });
      const payload = {
        data: allGifts,
        meta: {
          page,
          limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      };
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
      console.log('get all gifts error:', error);
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
      if (!gift) throw new NotFoundException('gift not found');
      return plainToInstance(GiftItemResponseDto, gift);
    } catch (error) {
      console.log('get gift by id error:', error);
      throw error;
    }
  }
}
