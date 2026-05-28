import { useVerification } from '../useVerification';
import { KeycloakService } from '@/modules/auth/services/keycloak.service';
import type { SendCodeResult, VerifyCodeResult } from '@/modules/auth/services/types';

// ── mocks ────────────────────────────────────────────────────────────────────
jest.mock('@/modules/auth/services/keycloak.service', () => ({
  KeycloakService: {
    sendVerificationCode: jest.fn(),
    verifyCode: jest.fn(),
  },
}));

const mockShowLoading = jest.fn();
const mockHideLoading = jest.fn();

jest.mock('@/shared/hooks/useLoading', () => ({
  useLoading: () => ({
    showLoading: mockShowLoading,
    hideLoading: mockHideLoading,
  }),
}));

// ── helpers ───────────────────────────────────────────────────────────────────
const mockSendVerificationCode = KeycloakService.sendVerificationCode as jest.Mock;
const mockVerifyCode = KeycloakService.verifyCode as jest.Mock;

const fakeSendCodeResult: SendCodeResult = {
  success: true,
  message: 'Código de verificação enviado com sucesso',
  codeId: '550e8400-e29b-41d4-a716-446655440000',
  expiresIn: { value: 5, unit: 'minutos' },
  expiresAt: '28/05/2026 20:35',
  destination: 'user@example.com',
  type: 'email',
};

const fakeVerifyCodeResult: VerifyCodeResult = {
  success: true,
  verified: true,
  message: 'Verificação realizada com sucesso',
  codeId: '550e8400-e29b-41d4-a716-446655440000',
  destination: 'user@example.com',
  type: 'email',
  verifiedAt: '2026-05-28T20:35:30.123Z',
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ── testes ────────────────────────────────────────────────────────────────────
describe('useVerification', () => {
  describe('sendCode', () => {
    it('retorna SendCodeResult completo do serviço', async () => {
      mockSendVerificationCode.mockResolvedValue(fakeSendCodeResult);

      const { sendCode } = useVerification();
      const result = await sendCode({ type: 'email', destination: 'user@example.com' });

      expect(result).toEqual(fakeSendCodeResult);
      expect(mockSendVerificationCode).toHaveBeenCalledWith({
        type: 'email',
        destination: 'user@example.com',
      });
    });

    it('propaga expiresIn com unidade minutos corretamente', async () => {
      mockSendVerificationCode.mockResolvedValue(fakeSendCodeResult);

      const { sendCode } = useVerification();
      const result = await sendCode({ type: 'email', destination: 'user@example.com' });

      expect(result.expiresIn).toEqual({ value: 5, unit: 'minutos' });
      expect(result.codeId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('funciona com tipo sms', async () => {
      const smsSendResult: SendCodeResult = {
        ...fakeSendCodeResult,
        destination: '11999990000',
        type: 'phone',
      };
      mockSendVerificationCode.mockResolvedValue(smsSendResult);

      const { sendCode } = useVerification();
      const result = await sendCode({ type: 'sms', destination: '11999990000' });

      expect(result.type).toBe('phone');
      expect(result.destination).toBe('11999990000');
    });

    it('chama showLoading antes e hideLoading depois do sucesso', async () => {
      mockSendVerificationCode.mockResolvedValue(fakeSendCodeResult);

      const { sendCode } = useVerification();
      await sendCode({ type: 'email', destination: 'user@example.com' });

      expect(mockShowLoading).toHaveBeenCalledTimes(1);
      expect(mockHideLoading).toHaveBeenCalledTimes(1);
    });

    it('chama hideLoading mesmo quando o serviço lança erro', async () => {
      mockSendVerificationCode.mockRejectedValue(new Error('Network error'));

      const { sendCode } = useVerification();
      await expect(sendCode({ type: 'email', destination: 'user@example.com' })).rejects.toThrow(
        'Network error',
      );

      expect(mockHideLoading).toHaveBeenCalledTimes(1);
    });

    it('propaga o erro original do serviço', async () => {
      const serviceError = new Error('Rate limit exceeded');
      mockSendVerificationCode.mockRejectedValue(serviceError);

      const { sendCode } = useVerification();
      await expect(sendCode({ type: 'sms', destination: '11999990000' })).rejects.toBe(
        serviceError,
      );
    });

    it('resolve sem lançar quando API retorna formato antigo sem expiresIn', async () => {
      // Garante que a ausência de expiresIn na resposta da API não provoca throw,
      // evitando que o catch da tela mostre "Não foi possível enviar o código."
      // por erro interno (bug: expirationToSeconds(undefined) jogava TypeError).
      const legacyApiResponse = { success: true, message: 'Código enviado' } as any;
      mockSendVerificationCode.mockResolvedValue(legacyApiResponse);

      const { sendCode } = useVerification();
      const result = await sendCode({ type: 'email', destination: 'user@example.com' });

      expect(result).toEqual(legacyApiResponse);
      expect(result.expiresIn).toBeUndefined();
    });
  });

  describe('verifyCode', () => {
    it('retorna VerifyCodeResult completo do serviço', async () => {
      mockVerifyCode.mockResolvedValue(fakeVerifyCodeResult);

      const { verifyCode } = useVerification();
      const result = await verifyCode({
        type: 'email',
        destination: 'user@example.com',
        code: '1234',
      });

      expect(result).toEqual(fakeVerifyCodeResult);
      expect(mockVerifyCode).toHaveBeenCalledWith({
        type: 'email',
        destination: 'user@example.com',
        code: '1234',
      });
    });

    it('retorna verified=false para código inválido', async () => {
      const failResult: VerifyCodeResult = {
        ...fakeVerifyCodeResult,
        success: false,
        verified: false,
        message: 'Código inválido ou expirado',
        codeId: undefined,
        verifiedAt: undefined,
      };
      mockVerifyCode.mockResolvedValue(failResult);

      const { verifyCode } = useVerification();
      const result = await verifyCode({
        type: 'email',
        destination: 'user@example.com',
        code: '9999',
      });

      expect(result.verified).toBe(false);
    });

    it('passa keycloakId opcional para o serviço', async () => {
      mockVerifyCode.mockResolvedValue(fakeVerifyCodeResult);

      const { verifyCode } = useVerification();
      await verifyCode({
        type: 'email',
        destination: 'user@example.com',
        code: '1234',
        keycloakId: 'kc-abc-123',
      });

      expect(mockVerifyCode).toHaveBeenCalledWith({
        type: 'email',
        destination: 'user@example.com',
        code: '1234',
        keycloakId: 'kc-abc-123',
      });
    });

    it('chama showLoading antes e hideLoading depois do sucesso', async () => {
      mockVerifyCode.mockResolvedValue(fakeVerifyCodeResult);

      const { verifyCode } = useVerification();
      await verifyCode({ type: 'email', destination: 'user@example.com', code: '1234' });

      expect(mockShowLoading).toHaveBeenCalledTimes(1);
      expect(mockHideLoading).toHaveBeenCalledTimes(1);
    });

    it('chama hideLoading mesmo quando o serviço lança erro', async () => {
      mockVerifyCode.mockRejectedValue(new Error('Verification failed'));

      const { verifyCode } = useVerification();
      await expect(
        verifyCode({ type: 'email', destination: 'user@example.com', code: '0000' }),
      ).rejects.toThrow('Verification failed');

      expect(mockHideLoading).toHaveBeenCalledTimes(1);
    });

    it('propaga o erro original do serviço', async () => {
      const serviceError = new Error('Server error');
      mockVerifyCode.mockRejectedValue(serviceError);

      const { verifyCode } = useVerification();
      await expect(
        verifyCode({ type: 'sms', destination: '11999990000', code: '1234' }),
      ).rejects.toBe(serviceError);
    });
  });
});
