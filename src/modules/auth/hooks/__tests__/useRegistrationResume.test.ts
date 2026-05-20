import { router } from 'expo-router';
import { useRegistrationResume } from '../useRegistrationResume';
import { useRegisterStore } from '@/modules/auth/store/register.store';
import { KeycloakService } from '@/modules/auth/services/keycloak.service';

// ── mocks ────────────────────────────────────────────────────────────────────
jest.mock('@/modules/auth/services/keycloak.service', () => ({
  KeycloakService: {
    getOnboardingStatus: jest.fn(),
  },
}));

jest.mock('@/modules/auth/store/register.store', () => ({
  useRegisterStore: {
    getState: jest.fn(),
  },
}));

// ── helpers ───────────────────────────────────────────────────────────────────
const mockGetOnboardingStatus = KeycloakService.getOnboardingStatus as jest.Mock;
const mockGetState = useRegisterStore.getState as jest.Mock;

const pendingRegistration = {
  keycloakId: 'kc-123',
  firstName: 'Anderson',
  lastName: 'Filho',
  email: 'anderson@test.com',
  phone: '11999990000',
  document: '12345678909',
  documentType: 'cpf',
  password: 'senha123',
};

function mockStoreState(
  pending: typeof pendingRegistration | null,
  clearPendingRegistration = jest.fn(),
) {
  mockGetState.mockReturnValue({
    pendingRegistration: pending,
    clearPendingRegistration,
  });
}

// ── testes ────────────────────────────────────────────────────────────────────
describe('useRegistrationResume', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAndResume', () => {
    it('retorna resumed=false quando não há pendingRegistration', async () => {
      mockStoreState(null);

      const { checkAndResume } = useRegistrationResume();
      const result = await checkAndResume();

      expect(result.resumed).toBe(false);
      expect(KeycloakService.getOnboardingStatus).not.toHaveBeenCalled();
    });

    it('limpa pendingRegistration e retorna resumed=false quando step=complete', async () => {
      const clearMock = jest.fn();
      mockStoreState(pendingRegistration, clearMock);
      mockGetOnboardingStatus.mockResolvedValue({
        step: 'complete',
        hasAddress: true,
        emailVerified: true,
        phoneVerified: true,
        hasDocument: true,
      });

      const { checkAndResume } = useRegistrationResume();
      const result = await checkAndResume();

      expect(result.resumed).toBe(false);
      expect(clearMock).toHaveBeenCalledTimes(1);
      expect(router.replace).not.toHaveBeenCalled();
    });

    it('redireciona para address quando step=address', async () => {
      mockStoreState(pendingRegistration);
      mockGetOnboardingStatus.mockResolvedValue({
        step: 'address',
        hasAddress: false,
        emailVerified: false,
        phoneVerified: false,
        hasDocument: false,
      });

      const { checkAndResume } = useRegistrationResume();
      const result = await checkAndResume();

      expect(result).toEqual({ resumed: true, step: 'address' });
      expect(router.replace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/(auth)/address',
          params: expect.objectContaining({
            keycloakId: 'kc-123',
            email: 'anderson@test.com',
            phone: '11999990000',
          }),
        }),
      );
    });

    it('redireciona para verification quando step=verification', async () => {
      mockStoreState(pendingRegistration);
      mockGetOnboardingStatus.mockResolvedValue({
        step: 'verification',
        hasAddress: true,
        emailVerified: false,
        phoneVerified: false,
        hasDocument: false,
      });

      const { checkAndResume } = useRegistrationResume();
      const result = await checkAndResume();

      expect(result).toEqual({ resumed: true, step: 'verification' });
      expect(router.replace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/(auth)/verification',
          params: expect.objectContaining({
            email: 'anderson@test.com',
            mode: 'post-register',
          }),
        }),
      );
    });

    it('redireciona para document-upload quando step=document', async () => {
      mockStoreState(pendingRegistration);
      mockGetOnboardingStatus.mockResolvedValue({
        step: 'document',
        hasAddress: true,
        emailVerified: true,
        phoneVerified: true,
        hasDocument: false,
      });

      const { checkAndResume } = useRegistrationResume();
      const result = await checkAndResume();

      expect(result).toEqual({ resumed: true, step: 'document' });
      expect(router.replace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/(auth)/document-upload',
          params: expect.objectContaining({
            keycloakId: 'kc-123',
            mode: 'post-register',
          }),
        }),
      );
    });

    it('retorna resumed=false e não redireciona quando API falha', async () => {
      mockStoreState(pendingRegistration);
      mockGetOnboardingStatus.mockRejectedValue(new Error('Network error'));

      const { checkAndResume } = useRegistrationResume();
      const result = await checkAndResume();

      expect(result.resumed).toBe(false);
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
