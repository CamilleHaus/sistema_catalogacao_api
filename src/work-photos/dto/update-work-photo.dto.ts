import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateWorkPhotoDto {
  @IsString()
  @MaxLength(2048)
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    // O storage local responde em http://localhost:9000, que não tem TLD.
    require_tld: false,
  })
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  creditos?: string | null;
}
