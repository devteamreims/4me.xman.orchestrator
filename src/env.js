/**
 * Wrapper around 4me.env
 */
import {} from 'dotenv/config';
import getEnv from '4me.env';

const env = getEnv(process.env.FOURME_ENV);

export default env;

export const xman = env.xman;
export const sectors = env.sectors;
