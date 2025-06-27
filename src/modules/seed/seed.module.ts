import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas';

@Module({
  providers: [SeedService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class SeedModule {}
