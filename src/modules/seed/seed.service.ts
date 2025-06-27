import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas';
import { UserRoleEnum } from '../../common/enums';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private readonly logger = new Logger(SeedService.name);

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers(): Promise<void> {
    const usersToSeed = [
      {
        email: 'creator@example.com',
        password: process.env.SEED_USER_PASSWORD,
        role: UserRoleEnum.CREATOR,
      },
      {
        email: 'reader@example.com',
        password: process.env.SEED_USER_PASSWORD,
        role: UserRoleEnum.READER,
      },
      {
        email: 'editor@example.com',
        password: process.env.SEED_USER_PASSWORD,
        role: UserRoleEnum.EDITOR,
      },
    ];

    for (const userData of usersToSeed) {
      const exists = await this.userModel
        .findOne({ email: userData.email })
        .exec();

      if (exists) {
        this.logger.log(`User ${userData.email} already exists. Skipping...`);
        continue;
      }

      await this.userModel.create(userData);
      this.logger.log(`User ${userData.email} created.`);
    }
  }
}
