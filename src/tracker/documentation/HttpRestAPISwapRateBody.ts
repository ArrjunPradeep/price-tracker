import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsNotEmpty, Matches, ArrayNotEmpty, IsNumber } from 'class-validator';

export class HttpRestApiSwapRateBody {

    @ApiPropertyOptional({
        type: 'number',
        description: "ETH Amount",
        default: 1
    })
    @IsNotEmpty({ message: 'Amount should not be empty' })
    @IsNumber({})
    public amount: number;

}