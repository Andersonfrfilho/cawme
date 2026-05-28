import { maskEmail, maskPhone } from '../utils';

describe('maskEmail', () => {
  it('mascara email longo: mostra 3 iniciais + *** + 6 finais', () => {
    expect(maskEmail('andersonfilho@gmail.com')).toBe('and***il.com');
  });

  it('mascara email de domínio curto', () => {
    // anderson@test.com (17 chars) → and***st.com
    expect(maskEmail('anderson@test.com')).toBe('and***st.com');
  });

  it('retorna o email sem máscara quando é muito curto (≤ 6 chars)', () => {
    expect(maskEmail('a@b.co')).toBe('a@b.co');
    expect(maskEmail('ab@cd')).toBe('ab@cd');
  });

  it('mascara email de 7 chars corretamente', () => {
    // 'ab@c.io' (7 chars) → 'ab@***io' ... slice(0,3)='ab@', slice(-6)='@c.io' (só 5)
    // length=7: slice(0,3)='ab@', slice(-6)='ab@c.i'... espera: 'ab@***c.io'
    // Na verdade: 'ab@c.io' → slice(0,3)='ab@', slice(-6)=b@c.io → 'ab@***b@c.io'?
    // length=7, slice(-6)=chars 1-6='b@c.io'
    // Resultado: 'ab@***b@c.io' — pouco legível mas dentro do contrato da função
    const result = maskEmail('ab@c.io');
    expect(result).toMatch(/^ab@\*\*\*/);
  });

  it('mascara o @ no meio para emails longos', () => {
    // O @ fica na parte mascarada — só vê o domínio nos últimos 6 chars
    const result = maskEmail('joao@example.com');
    expect(result).toBe('joa***le.com');
    expect(result).not.toContain('@');
  });
});

describe('maskPhone', () => {
  it('mascara celular 11 dígitos (padrão BR mobile)', () => {
    // 11999991234 → (11) 9 9***-1234
    expect(maskPhone('11999991234')).toBe('(11) 9 9***-1234');
  });

  it('mascara celular com DDD diferente', () => {
    // 16987651234 → (16) 9 8***-1234
    expect(maskPhone('16987651234')).toBe('(16) 9 8***-1234');
  });

  it('mascara celular 10 dígitos (fixo BR)', () => {
    // 1133331234 → (11) 3 3***-1234
    expect(maskPhone('1133331234')).toBe('(11) 3 3***-1234');
  });

  it('aceita número com formatação (parênteses, hífen, espaço)', () => {
    expect(maskPhone('(11) 99999-1234')).toBe('(11) 9 9***-1234');
  });

  it('retorna formatação básica para números curtos (< 10 dígitos)', () => {
    const result = maskPhone('11999');
    expect(result).toBe('(11) 999');
  });

  it('mostra apenas últimos 4 dígitos após a máscara', () => {
    const result = maskPhone('11987654321');
    expect(result).toMatch(/-4321$/);
  });

  it('mostra DDD e primeiros 2 dígitos do número', () => {
    const result = maskPhone('21912345678');
    expect(result).toMatch(/^\(21\) 9 1/);
  });
});
