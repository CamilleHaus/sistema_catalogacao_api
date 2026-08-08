"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCpf = normalizeCpf;
exports.isValidCpf = isValidCpf;
exports.maskCpf = maskCpf;
function normalizeCpf(value) {
    return value.replace(/\D/g, '');
}
function isValidCpf(value) {
    const cpf = normalizeCpf(value);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    const calculateDigit = (length) => {
        let sum = 0;
        for (let index = 0; index < length; index += 1) {
            sum += Number(cpf[index]) * (length + 1 - index);
        }
        const remainder = (sum * 10) % 11;
        return remainder === 10 ? 0 : remainder;
    };
    return (calculateDigit(9) === Number(cpf[9]) &&
        calculateDigit(10) === Number(cpf[10]));
}
function maskCpf(value) {
    if (!value)
        return null;
    return `***.${value.slice(3, 6)}.${value.slice(6, 9)}-**`;
}
//# sourceMappingURL=cpf.js.map