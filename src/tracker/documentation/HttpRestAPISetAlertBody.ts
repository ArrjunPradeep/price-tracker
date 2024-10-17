import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsNotEmpty, Matches, ArrayNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class HttpRestApiSetAlertBody {

    @ApiPropertyOptional({
        type: 'string',
        description: "Chain ID",
        default: '0x1'
    })
    @IsNotEmpty({ message: 'Amount should not be empty' })
    @IsString({message: 'Chain ID must 0x1 or 0x89'})
    public chain: string;

    @ApiPropertyOptional({
        type: 'number',
        description: "Price",
        default: 1030
    })
    @IsNotEmpty({ message: 'Price should not be empty' })
    @IsNumber({})
    public price: number;

    @ApiPropertyOptional({
        type: 'string',
        description: "Email ID",
        default: 'wodif66632@chainds.com'
    })
    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsString({message: 'Email ID'})
    @IsEmail({})
    public email: string;

}