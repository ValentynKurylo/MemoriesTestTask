import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { MemoriesService } from './memories.service';
import {
  CreateMemoryDto,
  FilterMemoriesDto,
  UpdateMemoryDto,
  AggregatedMemoriesResult,
} from './dtos';
import { Roles, RolesGuard, JwtAuthGuard } from '../../guards';
import { Memory } from '../../schemas';
import { UserRoleEnum } from '../../common/enums';
import { PaginationResponseDto } from '../../common/dtos';

@ApiTags('Memories')
@ApiBearerAuth()
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiOperation({ summary: 'Create a new memory' })
  @ApiResponse({ status: 201, description: 'Memory created', type: Memory })
  @ApiBody({ type: CreateMemoryDto })
  async create(@Body() dto: CreateMemoryDto): Promise<Memory> {
    return this.memoriesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.READER)
  @ApiOperation({
    summary: 'Get all memories (with optional filters or aggregation)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of memories or grouped memories',
    type: PaginationResponseDto,
  })
  @ApiQuery({ type: FilterMemoriesDto })
  async findAll(
    @Query() filter: FilterMemoriesDto,
  ): Promise<PaginationResponseDto<Memory> | AggregatedMemoriesResult> {
    return this.memoriesService.findAll(filter);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.EDITOR)
  @ApiOperation({ summary: 'Update memory by ID' })
  @ApiParam({ name: 'id', description: 'Memory ID' })
  @ApiBody({ type: UpdateMemoryDto })
  @ApiResponse({ status: 200, description: 'Memory updated', type: Memory })
  @ApiResponse({ status: 404, description: 'Memory not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMemoryDto,
  ): Promise<Memory> {
    const updated = await this.memoriesService.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Memory not found');
    }
    return updated;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.EDITOR)
  @ApiOperation({ summary: 'Delete memory by ID' })
  @ApiParam({ name: 'id', description: 'Memory ID' })
  @ApiResponse({ status: 200, description: 'Memory deleted' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const result = await this.memoriesService.delete(id);
    return result;
  }
}
