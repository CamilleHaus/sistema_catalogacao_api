import { UnidadeMedida } from '@prisma/client';
export declare function convertMeasurement(value: number, from: UnidadeMedida): {
    valor: number;
    unidade: "CM" | "IN";
};
export declare function presentDimension<T extends {
    altura: {
        toNumber(): number;
    } | null;
    largura: {
        toNumber(): number;
    } | null;
    profundidade: {
        toNumber(): number;
    } | null;
    unidade: UnidadeMedida | null;
    descricaoVariavel: string | null;
}>(dimension: T): (T & {
    formato: "VARIAVEL";
}) | (T & {
    formato: "NUMERICA";
    altura: number;
    largura: number;
    profundidade: number | null;
    conversao: {
        altura: {
            valor: number;
            unidade: "CM" | "IN";
        };
        largura: {
            valor: number;
            unidade: "CM" | "IN";
        };
        profundidade: {
            valor: number;
            unidade: "CM" | "IN";
        } | null;
    };
});
