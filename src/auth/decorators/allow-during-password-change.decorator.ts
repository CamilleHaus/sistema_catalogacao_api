import { SetMetadata } from '@nestjs/common';
import { ALLOW_DURING_PASSWORD_CHANGE_KEY } from '../auth.constants';

export const AllowDuringPasswordChange = () =>
  SetMetadata(ALLOW_DURING_PASSWORD_CHANGE_KEY, true);
