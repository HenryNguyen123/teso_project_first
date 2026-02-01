import { Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/modules/gifts/dtos/pagination.dto';
import { responseError, responseSuccess } from 'src/shared/utils/response.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemGift } from 'src/database/entities/system-gift.entity';
import { UserGift } from 'src/database/entities/user-gift.entity';

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
      console.log('allGifts:', allGifts);
      if (allGifts.length === 0)
        return responseError('get all gifts fail', 1009);
      const payload = {
        data: allGifts,
        meta: {
          page,
          limit,
          totalItems: Math.ceil(total / limit),
        },
      };
      return responseSuccess('get all gifts successfully', 0, payload);
    } catch (error) {
      console.log('get all gifts error:', error);
      return responseError('get all gifts fail', 1009);
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
      console.log('get gift by id error:', error);
      return responseError('get gift by id fail', 1010);
    }
  }
}
