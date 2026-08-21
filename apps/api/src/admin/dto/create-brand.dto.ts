import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, MinLength, IsEnum } from 'class-validator';
import { Industry, CampaignType, BudgetTier } from '@prisma/client';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  logo: string;

  @IsEnum(Industry)
  @IsNotEmpty()
  industry: Industry;

  @IsArray()
  @IsEnum(CampaignType, { each: true })
  campaignTypes: CampaignType[];

  @IsEnum(BudgetTier)
  @IsNotEmpty()
  budgetTier: BudgetTier;

  @IsOptional()
  requirements?: any;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  coverImage?: string;
}
