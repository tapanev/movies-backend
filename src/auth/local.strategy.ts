import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    // Override local stragey to allow auth using email
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User = await this.userModel.findOne({
      email,
    });

    if (!user) throw new NotFoundException('User not found');

    const matched = await bcrypt.compare(password, user.password);

    return matched
      ? {
          name: user?.name,
          email: user?.email,
        }
      : false;
  }
}
