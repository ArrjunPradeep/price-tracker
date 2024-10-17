import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';

@Injectable()
export class MoralisService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    Moralis.start({ apiKey: apiKey });
  }

  async getPrice(chain: string): Promise<any> {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
        chain: chain,
        address: chain === '0x1'? '0x2170ed0880ac9a755fd29b2688956bd959f933f8' : '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    });

    console.log("rwe8u23r932r23r13", response.result[0].usdPrice);

    return response.result[0].usdPrice;
  }

  async getPriceData(chain: string, address: string): Promise<any> {
    const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: chain,
        address: address,
    });

    return response.toJSON();
  }
}
