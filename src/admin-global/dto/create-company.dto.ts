import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CompanyDataDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;
}

class FirstAdminDataDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  cpf!: string;

  @IsString()
  @MinLength(8)
  senhaTemporaria!: string;
}

export class CreateCompanyDto {
  @ValidateNested()
  @Type(() => CompanyDataDto)
  empresa!: CompanyDataDto;

  @ValidateNested()
  @Type(() => FirstAdminDataDto)
  administrador!: FirstAdminDataDto;
}
