declare class CompanyDataDto {
    nome: string;
}
declare class FirstAdminDataDto {
    nome: string;
    email: string;
    cpf: string;
    senhaTemporaria: string;
}
export declare class CreateCompanyDto {
    empresa: CompanyDataDto;
    administrador: FirstAdminDataDto;
}
export {};
