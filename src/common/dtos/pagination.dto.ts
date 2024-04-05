import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {

	@ApiProperty({
		default: 5, description: "Number of Rows to Show"
	})
	@IsOptional()
	@IsPositive()
	@Type( () => Number )
	limit?: number;
	
	@ApiProperty({
		default: 0, description: "Number of Rows to Skip"
	})
	@IsOptional()
	@IsPositive()
	@Min( 0 )
	@Type( () => Number )
	offset?: number;
}