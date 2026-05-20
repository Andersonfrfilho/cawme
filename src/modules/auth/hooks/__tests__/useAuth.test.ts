import { router } from 'expo-router';
import { useAuth } from '../useAuth';
import { KeycloakService } from '@/modules/auth/services/keycloak.service';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import * as RegistrationResumeModule from '../useRegistrationResume';

// ── mocks ────────────────────────────────────────────────────────────────────
jest.mock('@/modules/auth/services/keycloak.service', () => ({
  KeycloakService: {
    login: jest.fn(),
    logout: jest.fn(),
    getVerificationStatus: jest.fn(),
  },
}));

jest.mock('@/modules/auth/store/auth.store', () => ({
  useAuthStore: Object.assign(
    jest.fn(() => ({
      setUser: jest.fn(),
      logout: jest.fn(),
      verificationStatus: { emailVerified: false, phoneVerified: false },
    })),
    {
      getState: jest.fn(() => ({
        verificationStatus: { emailVerified: false, phoneVerified: false },
        user: { phone: '11999990000' },
        setVerificationStatus: jest.fn(),
      })),
    },
  ),
}));

// ── helpers ───────────────────────────────────────────────────────────────────
const mockLogin = KeycloakService.login as jest.Mock;
const mockGetVerificationStatus = KeycloakService.getVerificationStatus as jest.Mock;
const mockCheckAndResume = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(RegistrationResumeModule, 'useRegistrationResume').mockReturnValue({
    checkAndResume: mockCheckAndResume,
  });
});

// ── testes ────────────────────────────────────────────────────────────────────
describe('useAuth', () => {
  describe('login', () => {
    it('interrompe o fluxo quando checkAndResume retorna resumed=true', async () => {
      mockLogin.mockResolvedValue({ id: 'u1', name: 'Anderson', email: 'a@test.com' });
      mockCheckAndResume.mockResolvedValue({ resumed: true, step: 'address' });

      const { login } = useAuth();
      await login({ username: 'a@test.com', password: '123' });

      expect(mockCheckAndResume).toHaveBeenCalledTimes(1);
      expect(KeycloakService.getVerificationStatus).not.toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalledWith('/(app)/home');
    });

    it('segue para checkVerificationStatus quando resumed=false', async () => {
      mockLogin.mockResolvedValue({ id: 'u1', name: 'Anderson', email: 'a@test.com' });
      mockCheckAndResume.mockResolvedValue({ resumed: false });
      mockGetVerificationStatus.mockResolvedValue({
        emailVerified: true,
        phoneVerified: true,
        status: 'VERIFIED',
      });

      const { login } = useAuth();
      await login({ username: 'a@test.com', password: '123' });

      expect(mockCheckAndResume).toHaveBeenCalledTimes(1);
      expect(KeycloakService.getVerificationStatus).toHaveBeenCalledTimes(1);
    });

    it('redireciona para verificação quando email não verificado', async () => {
      mockLogin.mockResolvedValue({ id: 'u1', name: 'Anderson', email: 'a@test.com' });
      mockCheckAndResume.mockResolvedValue({ resumed: false });
      mockGetVerificationStatus.mockResolvedValue({
        emailVerified: false,
        phoneVerified: false,
        status: 'PENDING',
      });

      const { login } = useAuth();
      await login({ username: 'a@test.com', password: '123' });

      expect(router.replace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/(auth)/verification',
          params: expect.objectContaining({ mode: 'post-login' }),
        }),
      );
    });

    it('lança erro quando KeycloakService.login falha', async () => {
      const error = new Error('Invalid credentials');
      mockLogin.mockRejectedValue(error);

      const { login } = useAuth();

      await expect(login({ username: 'wrong@test.com', password: 'wrong' })).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockCheckAndResume).not.toHaveBeenCalled();
    });
  });
});
