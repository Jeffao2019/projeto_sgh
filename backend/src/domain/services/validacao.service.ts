import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidacaoService {
  validarCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validarTelefone(telefone: string): boolean {
    // Remove caracteres não numéricos
    const numeroLimpo = telefone.replace(/[^\d]/g, '');

    // Verifica se tem 10 ou 11 dígitos (com ou sem nono dígito no celular)
    return numeroLimpo.length === 10 || numeroLimpo.length === 11;
  }

  validarCEP(cep: string): boolean {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/[^\d]/g, '');

    // Verifica se tem 8 dígitos
    return cepLimpo.length === 8;
  }

  validarIdade(dataNascimento: Date): boolean {
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();

    // Verifica se a idade está entre 0 e 150 anos
    return idade >= 0 && idade <= 150;
  }
}
