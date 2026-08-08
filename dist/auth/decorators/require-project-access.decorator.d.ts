import { PermissaoProjeto } from '@prisma/client';
export declare const RequireProjectAccess: (permissao?: PermissaoProjeto, paramName?: string) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
