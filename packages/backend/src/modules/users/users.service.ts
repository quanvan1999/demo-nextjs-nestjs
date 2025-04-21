import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { hashPassword } from '@/utils';
import aqp from 'api-query-params';
import { CheckCodeDto, CreateAuthDto, ResendCodeDto, ResendPasswordDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from '@/auth/dto/update-auth.dto';
import { GetUsersResponseDto } from './dto/get-users-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailerService: MailerService,
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

  async getUsers(query: string, current: number, pageSize: number): Promise<GetUsersResponseDto> {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const users = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    const result = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      image: user.image,
      role: user.role,
      accountType: user.accountType,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })) as UserResponseDto[];

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
    const codeId = uuidv4();
    const user = await this.userModel.create({
      password: hashedPassword,
      email,
      isActive: false,
      codeId,
      codeExpired: dayjs().add(5, 'minutes'),
      ...rest,
    });

    this.mailerService.sendMail({
      to: email,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: user.name,
        activationCode: codeId,
        _id: user._id,
      },
    });

    return { _id: user._id };
  }

  async checkCode(checkCodeDto: CheckCodeDto) {
    const { code, _id, email } = checkCodeDto;

    if (_id && !isValidObjectId(_id)) throw new BadRequestException('Invalid user id');

    const user = await this.userModel.findOne(_id ? { _id, codeId: code } : { email, codeId: code });

    if (!user) {
      throw new BadRequestException('Invalid code');
    }

    if (user.isActive) throw new BadRequestException('User already activated');

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (!isBeforeCheck) {
      throw new BadRequestException('Code expired');
    }

    await this.userModel.updateOne({ _id: user._id }, { isActive: true, codeId: null, codeExpired: null });

    return {
      _id: user._id,
    };
  }

  async resendCode(checkCodeDto: ResendCodeDto) {
    const { _id, email } = checkCodeDto;

    if (_id && !isValidObjectId(_id)) throw new BadRequestException('Invalid user id');

    const user = await this.userModel.findOne(_id ? { _id } : { email });

    if (!user) throw new BadRequestException('User not found');

    if (user.isActive) throw new BadRequestException('User already activated');

    const newCode = uuidv4();

    await this.userModel.updateOne({ _id: user._id }, { codeId: newCode, codeExpired: dayjs().add(5, 'minutes') });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account',
      template: 'register',
      context: {
        name: user.name,
        activationCode: newCode,
        currentYear: dayjs().year(),
      },
    });

    return {
      _id: user._id,
    };
  }

  async resendPassword(resendPasswordDto: ResendPasswordDto) {
    const { _id, email } = resendPasswordDto;

    if (_id && !isValidObjectId(_id)) throw new BadRequestException('Invalid user id');

    const user = await this.userModel.findOne(_id ? { _id } : { email });

    if (!user) throw new BadRequestException('User not found');

    const codeId = uuidv4();

    await this.userModel.updateOne({ _id: user._id }, { codeId, codeExpired: dayjs().add(5, 'minutes') });

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        name: user.name,
        resetCode: codeId,
        currentYear: dayjs().year(),
      },
    });

    return {
      _id: user._id,
      email: user.email,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { code, password, email, confirmPassword } = resetPasswordDto;

    if (password !== confirmPassword) throw new BadRequestException('Password and confirm password do not match');

    const user = await this.userModel.findOne({ codeId: code, email });

    if (!user) throw new BadRequestException('Invalid code');

    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (!isBeforeCheck) throw new BadRequestException('Code expired');

    const newPassword = await hashPassword(password);

    await this.userModel.updateOne({ _id: user._id }, { password: newPassword, codeId: null, codeExpired: null });

    return {
      _id: user._id,
    };
  }
}
