import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateWorkPhotoDto {
  @IsString()
  @MaxLength(2048)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  creditos?: string | null;
}
