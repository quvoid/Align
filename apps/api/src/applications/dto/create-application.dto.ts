import { IsString, IsNotEmpty, MinLength, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  proposal: string;

  @IsOptional()
  @IsNumber()
  expectedRate?: number;

  @IsArray()
  @IsString({ each: true })
  deliverables: string[];
}
