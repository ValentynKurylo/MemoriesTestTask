import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { MemoriesModule } from './memories/memories.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI),

    SeedModule,
    AuthModule,
    MemoriesModule,
  ],
})
export class AppModule {}
