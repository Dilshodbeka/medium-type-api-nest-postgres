import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserdto {
	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly password: string;
}