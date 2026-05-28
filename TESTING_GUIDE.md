# Provider Profile Setup — Testing Guide

## Quick Start

### Prerequisites
- Maestro CLI installed: `brew install mobile-dev-io/tap/maestro`
- iOS Simulator running or Android emulator
- App installed and ready to test

### Run Tests

```bash
# Happy path flow (complete setup)
maestro test .maestro/flows/provider-profile-happy-path-flow.yaml

# Validation flow (error cases)
maestro test .maestro/flows/provider-profile-validation-flow.yaml

# Run both in sequence
maestro test .maestro/flows/provider-profile-happy-path-flow.yaml && \
maestro test .maestro/flows/provider-profile-validation-flow.yaml
```

---

## Test Flows Overview

### 1. Happy Path Flow ✅
**File**: `.maestro/flows/provider-profile-happy-path-flow.yaml`

**Scenario**: Provider completes entire setup flow successfully

**Steps**:
1. **Categories Screen**
   - Display all categories
   - Select category 0 (e.g., "Limpeza")
   - Select category 1 (e.g., "Reparos")
   - Verify checkmarks visible
   - Tap "Continuar"

2. **Services Screen**
   - See category selector with both selected categories
   - Tap "Adicionar serviço"
   - Fill modal form:
     - Nome: "Limpeza Completa"
     - Duração: 120 minutos
     - Preço: R$ 150.00
   - Submit → service appears in list
   - Add second service:
     - Nome: "Limpeza Rápida"
     - Duração: 60 minutos
     - Preço: R$ 75.00
   - Tap "Continuar"

3. **Availability Screen**
   - See 7 days with toggle switches
   - Enable Segunda (Monday) → set 09:00 to 18:00
   - Enable Terça (Tuesday) → set 09:00 to 18:00
   - Enable Sexta (Friday) → set 10:00 to 17:00
   - Verify "3 dias selecionados" message
   - Tap "Continuar"

4. **Review Screen**
   - See "Categorias" section with both selected
   - See "Serviços" section:
     - "Limpeza Completa" (120min • R$150.00)
     - "Limpeza Rápida" (60min • R$75.00)
   - See "Disponibilidade" section:
     - Segunda: 09:00 - 18:00
     - Terça: 09:00 - 18:00
     - Sexta: 10:00 - 17:00
   - Tap "Finalizar cadastro"

5. **Success**
   - Redirected to home screen
   - Store cleared (ready for next setup)

**Duration**: ~30-40 seconds  
**Platform**: iOS, Android

---

### 2. Validation Flow ⚠️
**File**: `.maestro/flows/provider-profile-validation-flow.yaml`

**Scenario**: Test validation rules and disabled states

**Steps**:
1. **Categories Screen**
   - Try to tap "Continuar" without selection → button not visible
   - Select category 0 → button appears
   - Deselect → button disappears
   - Select category 0 again and continue

2. **Services Screen**
   - Try to submit empty form → error alert
   - Close modal
   - Add valid service (name, duration, price)
   - Tap "Continuar"

3. **Availability Screen**
   - Try to submit without days → error alert
   - Enable Monday with times
   - Tap "Continuar"

4. **Review Screen**
   - Verify one service and one day showing
   - Tap "Finalizar cadastro"

5. **Success**
   - Back to home screen

**Duration**: ~25-35 seconds  
**Platform**: iOS, Android

---

## Test Element IDs (testID)

### Categories Screen
- `category-card` — Each category card (indexed 0, 1, 2...)
- `action-bar-next-button` — "Continuar" button

### Services Screen
- `add-service-button` — "Adicionar serviço" button
- `service-name-input` — Service name text field
- `duration-input` — Duration field
- `price-input` — Hourly rate field
- `service-modal-submit-button` — Modal submit button
- `modal-close-button` — X button to close modal
- `action-bar-next-button` — "Continuar" button

### Availability Screen
- `day-toggle-N` — Toggle for day N (0-6, where 0=Sunday)
  - `day-toggle-1` = Monday
  - `day-toggle-2` = Tuesday
  - `day-toggle-5` = Friday
- `day-N-start-time` — Start time input for day N
- `day-N-end-time` — End time input for day N
- `action-bar-next-button` — "Continuar" button

### Review Screen
- `action-bar-submit-button` — "Finalizar cadastro" button

---

## Manual Testing Checklist

### Prerequisites
- [ ] App built and running on simulator/emulator
- [ ] User logged in and able to access provider profile setup
- [ ] Network connectivity verified (API/BFF reachable)

### Categories Screen
- [ ] All categories display in 2-column grid
- [ ] Tapping category toggles checkmark
- [ ] Multiple selections possible
- [ ] "Continuar" button disabled when no categories selected
- [ ] "Continuar" button enabled when ≥1 category selected
- [ ] Navigation to services screen works

### Services Screen
- [ ] Category selector shows only selected categories
- [ ] Category pills have active styling
- [ ] "Adicionar serviço" button opens modal
- [ ] Modal form has 3 inputs: name, duration, price
- [ ] Empty submission shows validation error
- [ ] Valid submission adds service to list
- [ ] Multiple services can be added
- [ ] Delete button removes service
- [ ] "Continuar" button disabled when no services
- [ ] "Continuar" button enabled when ≥1 service
- [ ] Navigation to availability screen works

### Availability Screen
- [ ] All 7 days visible with correct labels (Segunda-Domingo)
- [ ] Toggle switches enable/disable time inputs
- [ ] Time inputs only visible for enabled days
- [ ] Day counter updates correctly
- [ ] Empty submission shows validation error
- [ ] Multiple days can be selected
- [ ] "Continuar" button disabled when no days selected
- [ ] "Continuar" button enabled when ≥1 day
- [ ] Navigation to review screen works

### Review Screen
- [ ] Categories section shows all selected categories
- [ ] Services section shows all services grouped by category
- [ ] Each service shows name, duration, price
- [ ] Availability section shows each selected day with times
- [ ] "Finalizar cadastro" button submits data
- [ ] After submit, redirected to home screen
- [ ] Store state cleared after successful submit

### State Persistence
- [ ] Selections persist if user navigates back (before submit)
- [ ] Selections cleared after successful submit
- [ ] Refreshing screen during setup doesn't lose progress

### Error Handling
- [ ] Validation errors show appropriate messages
- [ ] API errors caught and displayed to user
- [ ] Network errors handled gracefully
- [ ] Can retry after error

---

## Debugging Tips

### If Test Fails
1. Check app is at correct screen (wait conditions might timeout)
2. Verify testIDs match between flow file and screen code
3. Check simulator/emulator is responsive
4. Review Maestro output for specific error

### Common Issues
- **"Timeout waiting for text"**: App navigation slower than expected, increase `timeout` in YAML
- **"Element not found"**: testID mismatch or element not visible (may need scroll)
- **"Input not focused"**: Try `eraseText` before `inputText` to clear field first
- **Network error**: Verify API/BFF running and Kong routing correctly

### View Maestro Details
```bash
maestro test <flow.yaml> --verbose
```

---

## Performance Expectations

| Screen | Load Time | Interaction Time | Total |
|--------|-----------|------------------|-------|
| Categories | 1-2s | 3-5s | 4-7s |
| Services | 1-2s | 5-10s | 6-12s |
| Availability | 1-2s | 3-5s | 4-7s |
| Review | 1-2s | 1-2s | 2-4s |
| **Total Flow** | — | — | **16-30s** |

---

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Provider Profile Tests
  run: |
    maestro test .maestro/flows/provider-profile-happy-path-flow.yaml
    maestro test .maestro/flows/provider-profile-validation-flow.yaml
```

### Pre-Deployment Checklist
- [ ] All TypeScript compiles (`npx tsc --noEmit`)
- [ ] All screens render without errors
- [ ] Happy path test passes
- [ ] Validation test passes
- [ ] Manual spot check on device/simulator

---

## Known Limitations

1. **Time Pickers**: Currently text input only. Future: native time picker component
2. **Test Timing**: May need adjustment based on device speed
3. **Network**: Tests assume working API/BFF/Kong connectivity
4. **Language**: Tests expect Portuguese UI strings

---

## Future Testing

- [ ] Integration tests for API/BFF layer
- [ ] Performance profiling (screen load times)
- [ ] Accessibility testing (VoiceOver, TalkBack)
- [ ] Offline mode testing
- [ ] Concurrent user testing
- [ ] Load testing for API endpoints
