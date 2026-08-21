import { IsOptional, IsString, IsArray, IsUrl, IsNumber, IsInt } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  niche?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  mediaKit?: string;

  // Instagram
  @IsOptional()
  @IsString()
  igHandle?: string;

  @IsOptional()
  @IsInt()
  igFollowers?: number;

  @IsOptional()
  @IsNumber()
  igEngagementRate?: number;

  @IsOptional()
  @IsInt()
  igAvgLikes?: number;

  @IsOptional()
  @IsInt()
  igAvgComments?: number;

  // YouTube
  @IsOptional()
  @IsString()
  ytChannel?: string;

  @IsOptional()
  @IsInt()
  ytSubscribers?: number;

  @IsOptional()
  @IsInt()
  ytAvgViews?: number;

  @IsOptional()
  @IsNumber()
  ytEngagementRate?: number;

  // Facebook
  @IsOptional()
  @IsString()
  fbPage?: string;

  @IsOptional()
  @IsInt()
  fbFollowers?: number;

  @IsOptional()
  @IsNumber()
  fbEngagementRate?: number;

  // X/Twitter
  @IsOptional()
  @IsString()
  xHandle?: string;

  @IsOptional()
  @IsInt()
  xFollowers?: number;

  @IsOptional()
  @IsNumber()
  xEngagementRate?: number;
}
