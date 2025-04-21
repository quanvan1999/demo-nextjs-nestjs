import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class GetUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  result: UserResponseDto[];

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;
}
