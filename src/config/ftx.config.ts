import { registerAs } from '@nestjs/config';

export default registerAs('ftx', () => ({
  account: JSON.parse(process.env.FTX_ACCOUNT) || {},
}));
