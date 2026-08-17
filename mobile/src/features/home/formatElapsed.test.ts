import { formatElapsed } from './formatElapsed';

describe('formatElapsed', () => {
  it('formata zero segundos como 00:00:00', () => {
    expect(formatElapsed(0)).toBe('00:00:00');
  });

  it('formata minutos e segundos', () => {
    expect(formatElapsed(125)).toBe('00:02:05');
  });

  it('formata horas', () => {
    expect(formatElapsed(3661)).toBe('01:01:01');
  });
});
