import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

@Schema()
export class User {
  @Prop({ required: true, unique: true, type: String })
  @IsEmail()
  email: string;

  @Prop({ required: true, unique: true, type: Boolean })
  isAdmin: boolean;

  @Prop({ type: String })
  username?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: String })
  name?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
