import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class MoralisService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    Moralis.start({ apiKey: apiKey });
  }

  async getPrice(chain: string): Promise<number> {
    const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: chain,
        address: chain === '0x1'? '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' : '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    });

    return response.toJSON().usdPrice;
  }
}
