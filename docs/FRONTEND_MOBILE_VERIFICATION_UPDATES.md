# Frontend Mobile - Verification Code Updates

**Version:** 1.0  
**Date:** 2026-05-27  
**Status:** Required for API v2 (Email + SMS verification with structured expiration)

---

## 📋 Overview

The backend API now returns verification code expiration information in a **structured format** instead of hardcoded string values. This allows your frontend to:

- ✅ Display dynamic countdown timers
- ✅ Validate expiration programmatically (not just strings)
- ✅ Support multiple units (minutos, horas, segundos)
- ✅ Handle both email and SMS in the same flow

**Breaking Change:** API response format has changed. Update your verification screens to consume the new `expiresIn` structure.

---

## 🔄 API Response Changes

### Before (Old)
```json
{
  "success": true,
  "message": "Código de verificação enviado com sucesso"
}
```

### After (New) - Send Verification
```json
{
  "success": true,
  "message": "Código de verificação enviado com sucesso",
  "codeId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": {
    "value": 5,
    "unit": "minutos"
  },
  "expiresAt": "27/05/2026 20:35",
  "destination": "user@example.com",
  "type": "email"
}
```

### After (New) - Verify Code
```json
{
  "success": true,
  "verified": true,
  "message": "Verificação realizada com sucesso",
  "codeId": "550e8400-e29b-41d4-a716-446655440000",
  "destination": "user@example.com",
  "type": "email",
  "verifiedAt": "2026-05-27T20:35:30.123Z"
}
```

---

## 💾 TypeScript Types

Add these types to your mobile project:

```typescript
// types/verification.ts

export interface ExpirationInfo {
  value: number;
  unit: 'minutos' | 'horas' | 'segundos';
}

export interface SendVerificationCodeResponse {
  success: boolean;
  message: string;
  codeId: string;
  expiresIn: ExpirationInfo;
  expiresAt: string;           // Formatted: "27/05/2026 20:35"
  destination: string;          // email or phone
  type: 'email' | 'phone';
}

export interface VerifyCodeResponse {
  success: boolean;
  verified: boolean;
  message: string;
  codeId?: string;
  destination: string;
  type: 'email' | 'phone';
  verifiedAt?: string;          // ISO timestamp
}
```

---

## 🎯 Implementation Examples

### 1. Send Verification Code

```typescript
// services/verification.service.ts

import type { SendVerificationCodeResponse, ExpirationInfo } from '../types/verification';

class VerificationService {
  async sendVerificationCode(
    type: 'email' | 'phone',
    destination: string
  ): Promise<SendVerificationCodeResponse> {
    const response = await api.post<SendVerificationCodeResponse>(
      '/onboarding/verification/send',
      { type, destination }
    );

    return response.data;
  }
}

// Usage in your verification screen
const { expiresIn, expiresAt, codeId } = await verificationService.sendVerificationCode(
  'email',
  'user@example.com'
);

console.log(`Code expires in: ${expiresIn.value} ${expiresIn.unit}`);
// Output: "Code expires in: 5 minutos"
```

### 2. Countdown Timer Implementation

```typescript
// components/VerificationCountdown.tsx

import React, { useState, useEffect } from 'react';
import type { ExpirationInfo } from '../types/verification';

interface Props {
  expiresIn: ExpirationInfo;
  onExpire: () => void;
}

export const VerificationCountdown: React.FC<Props> = ({ expiresIn, onExpire }) => {
  const [remaining, setRemaining] = useState<number>(
    convertToSeconds(expiresIn)
  );

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (next <= 0) {
          onExpire();
          clearInterval(timer);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="countdown-timer">
      <span className={remaining < 60 ? 'warning' : ''}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
      <p className="unit">{expiresIn.unit}</p>
    </div>
  );
};

// Helper function
function convertToSeconds(expiresIn: ExpirationInfo): number {
  const { value, unit } = expiresIn;
  
  switch (unit) {
    case 'segundos':
      return value;
    case 'minutos':
      return value * 60;
    case 'horas':
      return value * 60 * 60;
    default:
      return 0;
  }
}
```

### 3. Verification Screen Integration

```typescript
// screens/VerificationScreen.tsx

import React, { useState } from 'react';
import { VerificationCountdown } from '../components/VerificationCountdown';
import { verificationService } from '../services/verification.service';

interface VerificationState {
  destination: string;
  type: 'email' | 'phone';
  codeId: string;
  expiresIn: ExpirationInfo;
  expiresAt: string;
  isExpired: boolean;
}

export const VerificationScreen: React.FC = () => {
  const [state, setState] = useState<VerificationState | null>(null);
  const [code, setCode] = useState('');

  const handleSendCode = async (destination: string, type: 'email' | 'phone') => {
    try {
      const response = await verificationService.sendVerificationCode(type, destination);
      
      setState({
        destination: response.destination,
        type: response.type,
        codeId: response.codeId,
        expiresIn: response.expiresIn,
        expiresAt: response.expiresAt,
        isExpired: false,
      });
      
      // Show success: "Code sent. Valid for 5 minutos"
      showMessage(`${response.message} • Válido por ${response.expiresIn.value} ${response.expiresIn.unit}`);
    } catch (error) {
      showError('Failed to send code');
    }
  };

  const handleVerifyCode = async () => {
    if (!state) return;

    try {
      const response = await verificationService.verifyCode(
        state.type,
        state.destination,
        code
      );

      if (response.verified) {
        // Success! Navigate to next screen
        navigation.navigate('OnboardingComplete', {
          codeId: response.codeId,
          verifiedAt: response.verifiedAt,
        });
      } else {
        showError(response.message); // "Código inválido ou expirado"
      }
    } catch (error) {
      showError('Verification failed');
    }
  };

  const handleCodeExpired = () => {
    setState(prev => prev ? { ...prev, isExpired: true } : null);
    showWarning('Code has expired. Please request a new one.');
  };

  if (!state) {
    return (
      <View>
        {/* Send verification code UI */}
      </View>
    );
  }

  return (
    <View className="verification-screen">
      {/* Countdown Timer */}
      {!state.isExpired && (
        <VerificationCountdown
          expiresIn={state.expiresIn}
          onExpire={handleCodeExpired}
        />
      )}

      {/* Display expiration time */}
      <Text className="expiration-text">
        Expires at: {state.expiresAt}
      </Text>

      {/* Code input and verify button */}
      {state.isExpired ? (
        <Button onPress={() => handleSendCode(state.destination, state.type)}>
          Request New Code
        </Button>
      ) : (
        <>
          <TextInput
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            maxLength={4}
            keyboardType="numeric"
          />
          <Button onPress={handleVerifyCode}>
            Verify Code
          </Button>
        </>
      )}
    </View>
  );
};
```

### 4. Validate Time Programmatically

```typescript
// utils/verification-validation.ts

import type { ExpirationInfo } from '../types/verification';

/**
 * Validates if a code is still within the expiration window
 * Use for client-side validation (server will also validate)
 */
export function isCodeStillValid(
  sentAt: Date,
  expiresIn: ExpirationInfo
): boolean {
  const now = new Date();
  const expirationTime = new Date(
    sentAt.getTime() + convertToMilliseconds(expiresIn)
  );
  
  return now < expirationTime;
}

/**
 * Calculate remaining time in seconds
 */
export function getRemainingSeconds(
  sentAt: Date,
  expiresIn: ExpirationInfo
): number {
  const now = new Date();
  const expirationTime = new Date(
    sentAt.getTime() + convertToMilliseconds(expiresIn)
  );
  
  const remainingMs = expirationTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(remainingMs / 1000));
}

/**
 * Helper: Convert ExpirationInfo to milliseconds
 */
export function convertToMilliseconds(expiresIn: ExpirationInfo): number {
  const { value, unit } = expiresIn;
  
  switch (unit) {
    case 'segundos':
      return value * 1000;
    case 'minutos':
      return value * 60 * 1000;
    case 'horas':
      return value * 60 * 60 * 1000;
    default:
      return 0;
  }
}
```

---

## 🧪 Testing Checklist

- [ ] **Email verification flow**
  - [ ] Send code to email
  - [ ] Verify countdown timer shows "5 minutos"
  - [ ] Timer counts down and triggers expiration
  - [ ] Can still verify code before expiration
  - [ ] Cannot verify code after expiration

- [ ] **SMS verification flow**
  - [ ] Send code to phone
  - [ ] Verify countdown timer shows "5 minutos"
  - [ ] Same expiration behavior as email

- [ ] **UI/UX**
  - [ ] Display formatted expiration time: "27/05/2026 20:35"
  - [ ] Show unit in countdown: "5 minutos" (not just "300")
  - [ ] Warning state when < 1 minute remaining (color change)
  - [ ] "Request new code" button appears after expiration
  - [ ] Loading state while sending code
  - [ ] Error messages are localized

- [ ] **Edge Cases**
  - [ ] Device clock difference (code might be valid on server but expired on client)
  - [ ] Background/resume (timer should pause and resume correctly)
  - [ ] Screen rotation (timer state preserved)
  - [ ] Airplane mode → code sent but can't verify (handle gracefully)

---

## 📱 Integration Timeline

### Phase 1: Update types and services
- Add TypeScript types for new response format
- Update API service calls to consume `expiresIn` structure

### Phase 2: Update screens
- Replace hardcoded TTL with dynamic `expiresIn.value`
- Implement countdown timer component
- Add expiration handling

### Phase 3: Testing
- Test email verification flow end-to-end
- Test SMS verification flow end-to-end
- Test edge cases (expiration, device time sync, background state)

### Phase 4: Release
- Update app version
- Deploy to TestFlight/internal testing
- Monitor for issues
- Release to production

---

## ⚠️ Important Notes

1. **TTL is now 5 minutes** (was 10 minutes)
   - Verify this doesn't cause UX issues in your target markets
   - If users typically take >5 min to copy code, consider requesting feedback

2. **Client-side validation is supplementary**
   - Always validate server-side response
   - Don't trust client countdown timer for final decision

3. **Timezone handling**
   - `expiresAt` is formatted in user's locale: "27/05/2026 20:35"
   - `verifiedAt` is ISO timestamp (server time)
   - No timezone conversion needed on client

4. **Backward compatibility**
   - Old API endpoints will stop returning old format
   - Make sure you update all calls in the app
   - Old API version will be deprecated after 2 weeks

---

## 📞 Support

For questions about the verification flow:
1. Check BFF response format: `/onboarding/verification/send` endpoint
2. Review API response types above
3. Test with curl: 
   ```bash
   curl -X POST http://localhost:3001/bff/onboarding/verification/send \
     -H "Content-Type: application/json" \
     -d '{"type":"email","destination":"test@example.com"}'
   ```

---

**Last updated:** 2026-05-27  
**Next review:** After first production release
