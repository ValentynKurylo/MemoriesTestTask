import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../common/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiHideProperty()
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRoleEnum,
    example: UserRoleEnum.READER,
  })
  @Prop({ required: true, default: UserRoleEnum.READER })
  role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
