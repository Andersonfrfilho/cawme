import { useRegisterStore } from '../register.store';
import type { PendingOnboarding } from '../register.store';

// ── helpers ───────────────────────────────────────────────────────────────────
const initialState = {
  tempCredentials: null,
  address: null,
  keycloakId: null,
  pendingRegistration: null,
  pendingOnboarding: null,
};

beforeEach(() => {
  useRegisterStore.setState(initialState);
});

// ── testes ────────────────────────────────────────────────────────────────────
describe('useRegisterStore', () => {
  describe('pendingOnboarding', () => {
    it('inicia como null', () => {
      expect(useRegisterStore.getState().pendingOnboarding).toBeNull();
    });

    it('setPendingOnboarding salva email, phone e userType', () => {
      const data: PendingOnboarding = {
        email: 'contractor@test.com',
        phone: '11999990000',
        userType: 'contractor',
      };

      useRegisterStore.getState().setPendingOnboarding(data);

      expect(useRegisterStore.getState().pendingOnboarding).toEqual(data);
    });

    it('setPendingOnboarding aceita userType provider', () => {
      const data: PendingOnboarding = {
        email: 'provider@test.com',
        phone: '16988880000',
        userType: 'provider',
      };

      useRegisterStore.getState().setPendingOnboarding(data);

      expect(useRegisterStore.getState().pendingOnboarding?.userType).toBe('provider');
    });

    it('clearPendingOnboarding redefine para null', () => {
      useRegisterStore.getState().setPendingOnboarding({
        email: 'user@test.com',
        phone: '11999990000',
        userType: 'contractor',
      });

      useRegisterStore.getState().clearPendingOnboarding();

      expect(useRegisterStore.getState().pendingOnboarding).toBeNull();
    });

    it('setPendingOnboarding sobrescreve chamada anterior', () => {
      useRegisterStore.getState().setPendingOnboarding({
        email: 'old@test.com',
        phone: '11000000000',
        userType: 'contractor',
      });
      useRegisterStore.getState().setPendingOnboarding({
        email: 'new@test.com',
        phone: '22999990000',
        userType: 'provider',
      });

      const state = useRegisterStore.getState().pendingOnboarding;
      expect(state?.email).toBe('new@test.com');
      expect(state?.phone).toBe('22999990000');
      expect(state?.userType).toBe('provider');
    });

    it('clearPendingOnboarding não afeta outros campos do store', () => {
      useRegisterStore.setState({
        tempCredentials: { email: 'a@test.com', password: 'pass123' },
        keycloakId: 'kc-abc',
        pendingOnboarding: {
          email: 'a@test.com',
          phone: '11111111111',
          userType: 'contractor',
        },
      });

      useRegisterStore.getState().clearPendingOnboarding();

      expect(useRegisterStore.getState().pendingOnboarding).toBeNull();
      expect(useRegisterStore.getState().tempCredentials).toEqual({
        email: 'a@test.com',
        password: 'pass123',
      });
      expect(useRegisterStore.getState().keycloakId).toBe('kc-abc');
    });
  });
});
