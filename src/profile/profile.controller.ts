import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guadrs/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResponseInterface } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileServise: ProfileService) {}

  @Get(':username')
  async getUserProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileServise.getUserProfile(
      currentUserId,
      profileUsername,
    );
    return await this.profileServise.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followUser(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileServise.followProfile(
      currentUserId,
      profileUsername,
    );
    return await this.profileServise.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowUser(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileServise.unFollowUser(
      currentUserId,
      profileUsername,
    );
    return await this.profileServise.buildProfileResponse(profile);
  }
}
