import * as Joi from '@hapi/joi';

export const validationSchema = {
  FTX_ACCOUNT: Joi.string().required(),
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
  TELEGRAM_CHAT_ID: Joi.string().required(),
};
