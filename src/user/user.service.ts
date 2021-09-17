import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserdto } from './dto/loginUser.dto';
import { compare } from 'bcrypt'
import { UpdateUserDto } from './dto/updateUser.Dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) { }

	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const userByEmail = await this.userRepository.findOne({
			email: createUserDto.email,
		})
		const userByUsername = await this.userRepository.findOne({
			username: createUserDto.username,
		})
		if (userByEmail || userByUsername) {
			throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
		}
		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return await this.userRepository.save(newUser);
	}

	findById(id: number): Promise<UserEntity> {
		return this.userRepository.findOne(id);
	}

	async loginUser(loginUserDto: LoginUserdto): Promise<UserEntity> {
		const user = await this.userRepository.findOne({
			email: loginUserDto.email,
		}, {
			select: [
				'id', 'username', 'email', 'bio', 'image', 'password'
			]
		})
		if (!user) {
			throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
		}
		const isPasswordCorrect = await compare(loginUserDto.password, user.password)
		if (!isPasswordCorrect) {
			throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
		}
		delete user.password
		return user;
	}

	async updateUser(
		userId: number, 
		updateUserDto: UpdateUserDto,
	): Promise<UserEntity> {
		const user = await this.findById(userId);
		Object.assign(user, updateUserDto);
		return await this.userRepository.save(user)
	}

	generateJwt(user: UserEntity): string {
		return sign({
			id: user.id,
			username: user.username,
			email: user.email
		}, JWT_SECRET);
	}

	buildUserResponse(user: UserEntity): IUserResponse {
		return {
			user: {
				...user,
				token: this.generateJwt(user)
			}
		}
	}
}
