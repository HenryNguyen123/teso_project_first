import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { GiftPaginationDto } from 'src/modules/admin/gifts/dtos/pagination.dto';
import { AdminGiftsService } from 'src/modules/admin/gifts/gifts.service';
import { RoleAdminGuard } from 'src/modules/admin/auth/guards/roleGuardAdmin.guard';
import { UseGuards } from '@nestjs/common';
import { CreateGiftDto } from 'src/modules/admin/gifts/dtos/createGiftDto.dto';
import { UploadFileInterceptor } from 'src/common/interceptors/uploadFile.interceptor';
import { UpdateGiftStatusDto } from 'src/modules/admin/gifts/dtos/updateStatus.dto';
@Controller('admin/gifts')
export class AdminGiftsController {
  constructor(private adminGriftService: AdminGiftsService) {}
  //step: get all gifts
  @Get()
  @UseGuards(RoleAdminGuard)
  async getAllGifts(@Query() query: GiftPaginationDto): Promise<IResponse> {
    const gifts = await this.adminGriftService.getAllGifts(query);
    return gifts;
  }
  //step: get gift by id
  @Get(':id')
  @UseGuards(RoleAdminGuard)
  async getGiftById(@Param('id') id: number): Promise<IResponse> {
    const gift = await this.adminGriftService.getGiftById(id);
    return gift;
  }
  //step: create gift
  @Post()
  @UseGuards(RoleAdminGuard)
  @UseInterceptors(UploadFileInterceptor('image', './public/img/gifts'))
  async createGift(
    @Body() body: CreateGiftDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse> {
    const gift = await this.adminGriftService.createGift(body, file);
    return gift;
  }
  //step: update gift
  @Put(':id')
  @UseGuards(RoleAdminGuard)
  @UseInterceptors(UploadFileInterceptor('image', './public/img/gifts'))
  async updateGiftById(
    @Param('id') id: number,
    @Body() body: CreateGiftDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IResponse> {
    const gift = await this.adminGriftService.updateGiftById(id, body, file);
    return gift;
  }
  //step: update status gift
  @Patch(':id/status')
  @UseGuards(RoleAdminGuard)
  async updateStatusGift(
    @Param('id') id: number,
    @Body() body: UpdateGiftStatusDto,
  ): Promise<IResponse> {
    const gift = await this.adminGriftService.updateStatusGift(id, body);
    return gift;
  }
  //step: delete gift
  @Delete(':id')
  @UseGuards(RoleAdminGuard)
  async deleteGift(@Param('id') id: number): Promise<IResponse> {
    const gift = await this.adminGriftService.deleteGift(id);
    return gift;
  }
}
