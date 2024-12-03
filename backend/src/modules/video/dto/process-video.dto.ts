import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { VideoFilterType } from "../filter-type.enum";

export class ProcessVideoDto {
    @IsEnum(VideoFilterType)
    type: VideoFilterType;

    @IsOptional()
    @IsString()
    startTime?: string;
  
    @IsOptional()
    @IsString()
    duration?: string;
}
