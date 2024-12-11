import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { VideoFilterType } from "../filter-type.enum";
import { VideoOperationType } from "../video-operation.enum";

/*export class ProcessVideoDto {
    @IsEnum(VideoOperationType)
    operationType: VideoOperationType;

    @IsOptional()
    @IsEnum(VideoFilterType)
    filterType?: VideoFilterType;

    @IsOptional()
    @IsString()
    startTime?: string;
  
    @IsOptional()
    @IsString()
    duration?: string;
}*/

export class ProcessVideoDto {
    readonly operationType: VideoOperationType;
    readonly filterType?: VideoFilterType;
    readonly startTime?: string;
    readonly duration?: string;
}