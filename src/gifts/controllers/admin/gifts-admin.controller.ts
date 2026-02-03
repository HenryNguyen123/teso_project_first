import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { AdminGiftsService } from 'src/gifts/services/admin/gifts-admin.service';
import { RoleAdminGuard } from 'src/auth/guards/role-guard-admin.guard';
import { UseGuards } from '@nestjs/common';
import { CreateGiftDto } from 'src/gifts/dtos/request/create-gift-dto.dto';
import { UploadFileInterceptor } from 'src/common/interceptors/upload-file.interceptor';
import { UpdateGiftStatusDto } from 'src/gifts/dtos/request/update-gift-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GiftPaginationResponseDto } from 'src/gifts/dtos/response/gift-pagination-response-dto.dto';
import { GiftItemResponseDto } from 'src/gifts/dtos/response/get-all-gifts-response.dto';
import { UpdateGiftDto } from 'src/gifts/dtos/request/update-gift-dto.dto';
import { PaginationDto } from 'src/gifts/dtos/response/pagination.dto';
@Controller('admin/gifts')
export class AdminGiftsController {
  constructor(private adminGriftService: AdminGiftsService) {}
  //step: get all gifts
  @Get()
  @UseGuards(JwtAuthGuard, RoleAdminGuard)
  async getAllGifts(
    @Query() query: PaginationDto,
  ): Promise<GiftPaginationResponseDto> {
    const gifts = await this.adminGriftService.getAllGifts(query);
    return gifts;
  }
  //step: get gift by id
  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAdminGuard)
  async getGiftById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GiftItemResponseDto> {
    const gift = await this.adminGriftService.getGiftById(id);
    return gift;
  }
  //step: create gift
  @Post()
  @UseGuards(JwtAuthGuard, RoleAdminGuard)
  @UseInterceptors(UploadFileInterceptor('image', './public/img/gifts'))
  async createGift(
    @Body() body: CreateGiftDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GiftItemResponseDto> {
    const gift = await this.adminGriftService.createGift(body, file);
    return gift;
  }
  //step: update gift
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAdminGuard)
  @UseInterceptors(UploadFileInterceptor('image', './public/img/gifts'))
  async updateGiftById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGiftDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GiftItemResponseDto> {
    const gift = await this.adminGriftService.updateGiftById(id, body, file);
    return gift;
  }
  //step: update status gift
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RoleAdminGuard)
  async updateStatusGift(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGiftStatusDto,
  ): Promise<GiftItemResponseDto> {
    const gift = await this.adminGriftService.updateStatusGift(id, body);
    return gift;
  }
  //step: delete gift
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAdminGuard)
  async deleteGift(@Param('id') id: number): Promise<{ message: string }> {
    const gift = await this.adminGriftService.deleteGift(id);
    return gift;
  }
}
