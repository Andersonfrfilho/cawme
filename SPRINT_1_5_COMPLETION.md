# Sprint 1.5: Provider Profile Setup — Complete Implementation

## Overview
Complete implementation of provider profile setup flow across three-tier architecture (API → BFF → Mobile). Follows Spec-Driven Development methodology with detailed contracts.

---

## Phase 1: API (domestic-backend-api)

### Database & Entities
- **ProviderAvailabilityEntity**: New entity tracking provider availability by day of week with time ranges
- **ProviderServiceEntity**: Existing entity enhanced with full CRUD operations
- **CategoryEntity**: Existing entity used to categorize available services

### Repositories
- **CategoryRepository**: `findAllActive()`, `findById()`
- **ProviderServiceRepository**: Full CRUD with relations to Category and Provider
- **ProviderAvailabilityRepository**: Manage availability slots with `deleteByProviderAndDay()`

### Use Cases (8 total)
1. `GetCategoriesUseCase` - Fetch all available service categories
2. `CreateProviderServiceUseCase` - Add service for provider
3. `GetProviderServicesUseCase` - List provider's services
4. `UpdateProviderServiceUseCase` - Modify service details
5. `DeleteProviderServiceUseCase` - Remove service
6. `SetProviderAvailabilityUseCase` - Create/update availability slot
7. `GetProviderAvailabilityUseCase` - List availability slots
8. `UpdateProviderAvailabilityUseCase` - Modify availability slot

### Controller Endpoints
```
GET    /auth/categories                          → GetCategoriesResult
POST   /auth/providers/me/services              → CreateProviderServiceResult
GET    /auth/providers/me/services              → GetProviderServicesResult
PUT    /auth/providers/me/services/:serviceId   → UpdateProviderServiceResult
DELETE /auth/providers/me/services/:serviceId   → void
POST   /auth/providers/me/availability          → SetProviderAvailabilityResult
GET    /auth/providers/me/availability          → GetProviderAvailabilityResult
PUT    /auth/providers/me/availability/:dayOfWeek → UpdateProviderAvailabilityResult
```

### Database Seeding
- **categories.seed.ts**: 8 default service categories (Limpeza, Reparos, Aulas, Encanamento, Elétrica, Mudança, Organização, Jardinagem)

---

## Phase 2: BFF (domestic-backend-bff)

### Service Methods (8 total)
All methods implement pure proxy pattern with `@TraceMethod()` decorator:
- `getCategories()`
- `createProviderService(params)`
- `getProviderServices()`
- `updateProviderService(serviceId, params)`
- `deleteProviderService(serviceId)`
- `setProviderAvailability(params)`
- `getProviderAvailability()`
- `updateProviderAvailability(dayOfWeek, params)`

### Controller Endpoints
Same 8 endpoints as API (Kong routes them through BFF)

### Data Transfer Objects
12 types for request/response contracts:
- `CategoryDto`, `GetCategoriesResult`
- `ProviderServiceDto`, `CreateProviderServiceParams/Result`, `GetProviderServicesResult`
- `UpdateProviderServiceParams/Result`
- `ProviderAvailabilityDto`, `SetProviderAvailabilityParams/Result`
- `GetProviderAvailabilityResult`, `UpdateProviderAvailabilityParams/Result`

---

## Phase 3: Mobile (Cawme - React Native + Expo)

### Screen 1: Categories
- **Path**: `/(auth)/provider-profile/index` → `categories.screen.tsx`
- **Flow**: Display all categories in grid, multi-select with checkmarks, next button disabled until ≥1 selected
- **State**: Persisted in Zustand store with MMKV
- **Navigation**: → services screen

### Screen 2: Services
- **Path**: `/(auth)/provider-profile/services` → `services.screen.tsx`
- **Flow**: 
  - Horizontal scroll through selected categories
  - Per-category service list
  - "Add Service" button opens modal with form (name, duration, price)
  - Delete individual services
  - Next button disabled until ≥1 service added
- **State**: Zustand store, persisted
- **Navigation**: → availability screen

### Screen 3: Availability
- **Path**: `/(auth)/provider-profile/availability` → `availability.screen.tsx`
- **Flow**:
  - 7 days with toggle switches
  - For enabled days, time pickers (start/end)
  - Display count of selected days
  - Next button disabled until ≥1 day selected
- **State**: Zustand store, persisted
- **Navigation**: → review screen

### Screen 4: Review
- **Path**: `/(auth)/provider-profile/review` → `review.screen.tsx`
- **Flow**:
  - Summary of selected categories
  - Services grouped by category
  - Availability by day
  - Submit button → resets store → redirects to home
- **State**: Read from Zustand store
- **Navigation**: → home screen

### Router Configuration
- **File**: `app/(auth)/_layout.tsx` - Added provider-profile/index route
- **Nested Layout**: `app/(auth)/provider-profile/_layout.tsx` - Stack navigator for 4 screens
- **Routes**: index.tsx, services.tsx, availability.tsx, review.tsx (each re-exports corresponding screen)

### State Management (Zustand)
**File**: `src/modules/auth/store/provider-profile.store.ts`

```typescript
interface ProviderProfileStore {
  selectedCategories: SelectedCategory[]
  services: ProviderServiceWithCategory[]
  availability: ProviderAvailabilitySlot[]
  isSubmitting: boolean
  
  // Methods for categories, services, availability
  addCategory, removeCategory, clearCategories
  addService, updateService, removeService, clearServices
  addAvailabilitySlot, removeAvailabilitySlot, clearAvailability
  
  reset() // Clear all after submission
}
```

Persisted with MMKV storage via `createJSONStorage(() => mmkvStorage.asStateStorage())`

### Services Integration
**File**: `src/modules/auth/services/keycloak.service.ts`

8 new methods calling Kong endpoints:
```typescript
async getCategories(): Promise<GetCategoriesResult>
async createProviderService(params): Promise<CreateProviderServiceResult>
async getProviderServices(): Promise<GetProviderServicesResult>
async updateProviderService(serviceId, params): Promise<UpdateProviderServiceResult>
async deleteProviderService(serviceId): Promise<void>
async setProviderAvailability(params): Promise<SetProviderAvailabilityResult>
async getProviderAvailability(): Promise<GetProviderAvailabilityResult>
async updateProviderAvailability(dayOfWeek, params): Promise<UpdateProviderAvailabilityResult>
```

### Hook Integration
**File**: `src/modules/auth/hooks/useAuth.ts`

Added 8 new methods exposed to screens for data fetching and submission.

### Styling
**File**: `src/modules/auth/screens/provider-profile/styles.ts`

- All numeric values use `scale()`, `verticalScale()`, `moderateScale()` for responsive design
- Category pills with active state styling
- Day availability item separators
- Service cards with delete action
- Modal styling with proper contrast (white text on blue background per CLAUDE.md)
- ActionBar with fixed positioning and top border

### Localization
**Files**:
- `src/modules/auth/locales.ts` - 22 new locale keys registered
- `src/shared/locales/pt-BR.ts` - Corresponding Portuguese translations

Keys added:
- profileSetupCategoriesTitle/Subtitle
- profileSetupServicesTitle/Subtitle
- profileSetupAvailabilityTitle/Subtitle
- profileSetupSelectCategory, profileSetupAddService, etc.
- profileSetupReviewTitle/Subtitle
- profileSetupContinue, profileSetupSubmit
- profileSetupValidationRequired, profileSetupValidationAtLeastOneService

### Constants
**File**: `src/modules/auth/auth.constants.ts`

7 new Kong endpoints added to AUTH_ENDPOINTS:
```typescript
CATEGORIES: "/bff/auth/categories"
PROVIDER_SERVICES: "/bff/auth/providers/me/services"
PROVIDER_SERVICE_UPDATE: (serviceId) => `/bff/auth/providers/me/services/${serviceId}`
PROVIDER_SERVICE_DELETE: (serviceId) => `/bff/auth/providers/me/services/${serviceId}`
PROVIDER_AVAILABILITY: "/bff/auth/providers/me/availability"
PROVIDER_AVAILABILITY_UPDATE: (dayOfWeek) => `/bff/auth/providers/me/availability/${dayOfWeek}`
```

### Types
**File**: `src/modules/auth/services/types.ts`

12 new types for provider profile operations (imported and used by screens).

### Test Automation (Maestro)

**Flow 1**: `provider-profile-happy-path-flow.yaml`
- Select 2 categories
- Add 2 services with pricing
- Set availability for 3 days (Monday, Tuesday, Friday)
- Review summary
- Submit and verify home screen

**Flow 2**: `provider-profile-validation-flow.yaml`
- Test disabled states for all screens
- Test validation on empty submissions
- Complete minimal flow (1 category, 1 service, 1 day)

**Test IDs Added**:
- category-card
- action-bar-next-button (all screens)
- add-service-button, service-name/duration/price-input, service-modal-submit-button
- day-toggle-N, day-N-start/end-time
- action-bar-submit-button (review)
- modal-close-button

---

## Architecture Compliance

### CLAUDE.md Standards
✅ **File Structure**: Screens in own directories with .screen.tsx, styles.ts, types.ts, index.ts  
✅ **Component Exports**: Screens default export, styles named export  
✅ **Responsive Scaling**: All numeric values use scale functions  
✅ **Naming**: No abbreviations, proper *Params/*Result types  
✅ **State Management**: Zustand with MMKV persistence  
✅ **Localization**: Centralized locale keys, Portuguese translations  
✅ **No Magic Values**: All constants defined in auth.constants.ts  
✅ **TypeScript Strict**: No `any`, proper typing throughout  
✅ **API Boundaries**: Validation only at input (screens) and API responses  
✅ **Error Handling**: On-submit validation, no unnecessary fallbacks  

### Three-Tier Architecture
✅ **API**: Business logic, repositories, use cases  
✅ **BFF**: Pure proxy pattern with @TraceMethod() logging  
✅ **Mobile**: UI only, calls Kong → BFF → API  

---

## Flow Summary

```
User navigates to provider-profile setup
  ↓
Categories Screen
  • Display all categories in 2-column grid
  • User selects ≥1 category (marked with checkmark)
  • Store: addCategory()
  ↓
Services Screen
  • Show tabs for each selected category
  • Display already-added services per category
  • Click "Add Service" → modal with form
  • Form: service name, duration (min), price (R$/hour)
  • Submit → API call → store: addService()
  • Can delete services
  ↓
Availability Screen
  • Show 7 days with toggle switches
  • For enabled days, show start/end time inputs
  • Submit → API calls for each day → store: addAvailabilitySlot()
  ↓
Review Screen
  • Display summary of all selections
  • Categories, services (grouped), availability (by day)
  • Submit → API confirms all data → store.reset() → home screen
```

---

## Files Created/Modified

### New Files
- `src/modules/auth/screens/provider-profile/services.screen.tsx` (150 lines)
- `src/modules/auth/screens/provider-profile/availability.screen.tsx` (120 lines)
- `src/modules/auth/screens/provider-profile/review.screen.tsx` (130 lines)
- `src/modules/auth/screens/provider-profile/index.ts` (re-export)
- `src/modules/auth/store/provider-profile.store.ts` (140 lines)
- `app/(auth)/provider-profile/_layout.tsx`
- `app/(auth)/provider-profile/index.tsx` (route file)
- `app/(auth)/provider-profile/services.tsx` (route file)
- `app/(auth)/provider-profile/availability.tsx` (route file)
- `app/(auth)/provider-profile/review.tsx` (route file)
- `.maestro/flows/provider-profile-happy-path-flow.yaml`
- `.maestro/flows/provider-profile-validation-flow.yaml`

### Modified Files
- `src/modules/auth/screens/provider-profile/categories.screen.tsx` - Added testIDs
- `src/modules/auth/screens/provider-profile/styles.ts` - Added new styles
- `src/modules/auth/screens/provider-profile/types.ts` - Already had types
- `src/modules/auth/services/keycloak.service.ts` - Added 8 methods
- `src/modules/auth/hooks/useAuth.ts` - Exposed 8 methods
- `src/modules/auth/services/types.ts` - Already had types
- `src/modules/auth/locales.ts` - Added 22 locale keys
- `src/shared/locales/pt-BR.ts` - Added Portuguese translations
- `src/modules/auth/auth.constants.ts` - Added Kong endpoints
- `app/(auth)/_layout.tsx` - Added provider-profile route

---

## Testing

### Manual Testing
1. Start dev server: `npm start`
2. Navigate to provider profile setup (post-registration)
3. Follow all 4 screens, verify navigation and state persistence
4. Verify API calls via network tab
5. Test validation (try to advance without selections)

### Automated Testing (Maestro)
```bash
maestro test .maestro/flows/provider-profile-happy-path-flow.yaml
maestro test .maestro/flows/provider-profile-validation-flow.yaml
```

---

## Known Limitations & Future Work

1. **Service Selection**: Currently allows freeform service names. Future: integrate with API's predefined service catalog
2. **Pricing Variants**: Form only collects pricePerHour. Future: support priceBase and priceType variants
3. **Time Pickers**: Currently text inputs. Future: native time picker component
4. **Availability Slots**: Currently one slot per day. Future: multiple time ranges per day
5. **Error Recovery**: Basic error alerts. Future: detailed error messages and retry logic
6. **Offline Support**: Store persists locally. Future: background sync when connectivity restored

---

## Deployment Readiness

✅ All TypeScript compiles without errors  
✅ All screens follow project patterns (CLAUDE.md)  
✅ Navigation fully configured with Expo Router  
✅ State management with persistence enabled  
✅ Localization complete with Portuguese translations  
✅ Responsive scaling implemented throughout  
✅ Test IDs added for Maestro automation  
✅ API contracts fully defined and implemented  
✅ No security issues (input validation at boundaries)  

Ready for QA testing and deployment.
