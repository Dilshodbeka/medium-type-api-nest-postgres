import { IsNotEmpty } from 'class-validator';

export class GetUserProfileDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly bio: string;

  @IsNotEmpty()
  readonly image: string;

  @IsNotEmpty()
  readonly following: boolean;
}