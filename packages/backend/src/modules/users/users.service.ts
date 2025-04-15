import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { hashPassword } from '@/utils';
import aqp from 'api-query-params';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  isEmailExists = async (email: string) => {
    const user = await this.userModel.exists({ email });

    return !!user;
  };

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    const isEmailExists = await this.isEmailExists(email);

    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.userModel.create({
      password: hashedPassword,
      email,
      ...rest,
    });

    return {
      _id: user._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const result = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return { result, totalPages, totalItems };
  }

  async findOne(_id: string) {
    const user = await this.userModel.find({ _id });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    if (!isValidObjectId(_id)) throw new BadRequestException('Invalid user id');

    const result = await this.userModel.deleteOne({ _id });

    return result.deletedCount;
  }

  async register(registerDto: CreateAuthDto) {
    const { email, password, ...rest } = registerDto;

    const isEmailExists = await this.isEmailExists(email);

    if (isEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.userModel.create({
      password: hashedPassword,
      email,
      isActive: false,
      codeId: uuidv4(),
      codeExpired: dayjs().add(3, 'days'),
      ...rest,
    });

    return user;
  }
}
