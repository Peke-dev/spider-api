import { ConfigType } from '@nestjs/config';
import { configuration } from './configuration';

export type GlobalConfigType = ConfigType<typeof configuration>;
