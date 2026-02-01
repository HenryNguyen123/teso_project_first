import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { GiftPaginationDto } from 'src/modules/admin/gifts/dtos/pagination.dto';
import { AdminGiftsService } from 'src/modules/admin/gifts/gifts.service';
import { responseError } from 'src/shared/utils/response.util';
import { RoleAdminGuard } from 'src/modules/admin/auth/guards/roleGuardAdmin.guard';
import { UseGuards } from '@nestjs/common';
import { CreateGiftDto } from 'src/modules/admin/gifts/dtos/createGiftDto.dto';
import { UploadFileInterceptor } from 'src/common/interceptors/uploadFile.interceptor';
import type { Request } from 'express';
@Controller('admin/gifts')
export class AdminGiftsController {
  constructor(private adminGriftService: AdminGiftsService) {}
  //step: get all gifts
  @Get()
  @UseGuards(RoleAdminGuard)
  async getAllGifts(@Query() query: GiftPaginationDto): Promise<IResponse> {
    try {
      const gifts = await this.adminGriftService.getAllGifts(query);
      return gifts;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: get gift by id
  @Get(':id')
  @UseGuards(RoleAdminGuard)
  async getGiftById(@Param('id') id: number): Promise<IResponse> {
    try {
      const gift = await this.adminGriftService.getGiftById(id);
      return gift;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: create gift
  @Post()
  @UseGuards(RoleAdminGuard)
  @UseInterceptors(UploadFileInterceptor('image', './public/img/gifts'))
  async createGift(
    @Body() body: CreateGiftDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<IResponse> {
    try {
      const gift = await this.adminGriftService.createGift(body, file, req);
      return gift;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: update gift
  @Post(':id')
  @UseGuards(RoleAdminGuard)
  @UseInterceptors(UploadFileInterceptor('image', './public/img/gifts'))
  async updateGiftById(
    @Param('id') id: number,
    @Body() body: CreateGiftDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<IResponse> {
    try {
      const gift = await this.adminGriftService.updateGiftById(
        id,
        body,
        file,
        req,
      );
      return gift;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: update status gift
  @Post('status/:id')
  @UseGuards(RoleAdminGuard)
  async updateStatusGift(
    @Param('id') id: number,
    @Body() body: { isActive: boolean },
    @Req() req: Request,
  ): Promise<IResponse> {
    try {
      const gift = await this.adminGriftService.updateStatusGift(id, body, req);
      return gift;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
  //step: delete gift
  @Delete(':id')
  @UseGuards(RoleAdminGuard)
  async deleteGift(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<IResponse> {
    try {
      const gift = await this.adminGriftService.deleteGift(id, req);
      return gift;
    } catch (error) {
      console.log(error);
      return responseError('Internal server error', -500);
    }
  }
}
