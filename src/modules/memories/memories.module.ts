import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemoriesController } from './memories.controller';
import { MemoriesService } from './memories.service';
import { Memory, MemorySchema } from '../../schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MemoriesController],
  providers: [MemoriesService],
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
    AuthModule,
  ],
})
export class MemoriesModule {}
