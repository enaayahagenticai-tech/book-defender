import React from 'react';
import { act, create } from 'react-test-renderer';
import { BiometricGate } from '../BiometricGate';
import { useSecurityStore } from '@/lib/store/security';
import { useAuthStore } from '@/lib/store/auth';
import * as LocalAuthentication from 'expo-local-authentication';

// Mock stores
jest.mock('@/lib/store/security', () => ({
  useSecurityStore: jest.fn(),
}));

jest.mock('@/lib/store/auth', () => ({
  useAuthStore: jest.fn(),
}));

// Mock LocalAuthentication
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(),
  isEnrolledAsync: jest.fn(),
  authenticateAsync: jest.fn(),
}));

describe('BiometricGate', () => {
  let mockLockApp: jest.Mock;
  let mockUnlockApp: jest.Mock;
  let mockSetLastActive: jest.Mock;

  beforeEach(() => {
    mockLockApp = jest.fn();
    mockUnlockApp = jest.fn();
    mockSetLastActive = jest.fn();

    // Default mock implementation
    (useSecurityStore as unknown as jest.Mock).mockReturnValue({
      isLocked: true,
      lastActive: null,
      biometricsEnabled: true,
      lockApp: mockLockApp,
      unlockApp: mockUnlockApp,
      setLastActive: mockSetLastActive,
    });

    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user' } },
    });

    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.isEnrolledAsync as jest.Mock).mockResolvedValue(true);
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: true });
  });

  it('renders children if not locked', () => {
    (useSecurityStore as unknown as jest.Mock).mockReturnValue({
      isLocked: false,
      biometricsEnabled: true,
      lockApp: mockLockApp,
      unlockApp: mockUnlockApp,
      setLastActive: mockSetLastActive,
    });

    const component = create(
      <BiometricGate>
        <React.Fragment>Protected Content</React.Fragment>
      </BiometricGate>
    );

    expect(component.toJSON()).toEqual('Protected Content');
  });

  it('renders children if biometrics are disabled', () => {
    (useSecurityStore as unknown as jest.Mock).mockReturnValue({
      isLocked: true,
      biometricsEnabled: false,
      lockApp: mockLockApp,
      unlockApp: mockUnlockApp,
      setLastActive: mockSetLastActive,
    });

    const component = create(
      <BiometricGate>
        <React.Fragment>Protected Content</React.Fragment>
      </BiometricGate>
    );

    expect(component.toJSON()).toEqual('Protected Content');
  });

  it('prompts for authentication when locked and biometrics enabled', async () => {
    await act(async () => {
        create(
            <BiometricGate>
            <React.Fragment>Protected Content</React.Fragment>
            </BiometricGate>
        );
    });

    expect(LocalAuthentication.authenticateAsync).toHaveBeenCalled();
  });

  it('unlocks app on successful authentication', async () => {
    await act(async () => {
        create(
            <BiometricGate>
            <React.Fragment>Protected Content</React.Fragment>
            </BiometricGate>
        );
    });

    expect(mockUnlockApp).toHaveBeenCalled();
  });

  it('does not unlock app on failed authentication', async () => {
    (LocalAuthentication.authenticateAsync as jest.Mock).mockResolvedValue({ success: false });

    await act(async () => {
        create(
            <BiometricGate>
            <React.Fragment>Protected Content</React.Fragment>
            </BiometricGate>
        );
    });

    expect(mockUnlockApp).not.toHaveBeenCalled();
  });

  it('unlocks app if hardware not available', async () => {
    (LocalAuthentication.hasHardwareAsync as jest.Mock).mockResolvedValue(false);

    await act(async () => {
        create(
            <BiometricGate>
            <React.Fragment>Protected Content</React.Fragment>
            </BiometricGate>
        );
    });

    expect(mockUnlockApp).toHaveBeenCalled();
  });
});
