# Sprint 1.5 — Provider Profile Setup

**Objective:** Enable providers to complete their profile by selecting service categories, setting availability schedules, and defining service offerings with time estimates and pricing.

**Scope:** domestic-backend-api, domestic-backend-bff, cawme

---

## 1. Domain Model

### Service Category
```
{
  id: string (UUID)
  name: string (e.g., "Limpeza", "Reparos", "Aulas")
  description: string
  icon: string (e.g., "broom", "tools", "book")
  createdAt: timestamp
}
```

### Provider Service
```
{
  id: string (UUID)
  providerId: string (User.id)
  categoryId: string (ServiceCategory.id)
  name: string (e.g., "Limpeza Residencial")
  description: string
  estimatedDurationMinutes: number (e.g., 120)
  pricePerHour: decimal (e.g., 50.00)
  active: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Provider Availability
```
{
  id: string (UUID)
  providerId: string (User.id)
  dayOfWeek: 0-6 (0=Sunday, 6=Saturday)
  startTime: "HH:mm" (e.g., "08:00")
  endTime: "HH:mm" (e.g., "18:00")
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## 2. API Endpoints

### Service Categories

**GET /v1/categories**
- Return all available service categories
- No auth required (public list)
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "cat-001",
        "name": "Limpeza",
        "description": "Serviços de limpeza residencial e comercial",
        "icon": "broom"
      }
    ]
  }
  ```

### Provider Services

**POST /v1/providers/me/services**
- Create new service offering for authenticated provider
- Auth: Required (X-User-Id header)
- Body:
  ```json
  {
    "categoryId": "cat-001",
    "name": "Limpeza Residencial Completa",
    "description": "Limpeza de toda a casa incluindo...",
    "estimatedDurationMinutes": 120,
    "pricePerHour": 50.00
  }
  ```
- Response: `{ success: true, data: { id, categoryId, name, ... } }`

**GET /v1/providers/me/services**
- List all services for authenticated provider
- Auth: Required
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "svc-001",
        "categoryId": "cat-001",
        "name": "Limpeza Residencial",
        "estimatedDurationMinutes": 120,
        "pricePerHour": 50.00,
        "active": true
      }
    ]
  }
  ```

**PUT /v1/providers/me/services/:serviceId**
- Update service details
- Auth: Required
- Body: Same as POST (partial update allowed)
- Response: Updated service object

**DELETE /v1/providers/me/services/:serviceId**
- Deactivate service (soft delete)
- Auth: Required
- Response: `{ success: true }`

### Provider Availability

**POST /v1/providers/me/availability**
- Set working hours for a specific day
- Auth: Required
- Body:
  ```json
  {
    "dayOfWeek": 1,
    "startTime": "08:00",
    "endTime": "18:00"
  }
  ```
- Response: `{ success: true, data: { id, dayOfWeek, startTime, endTime } }`

**GET /v1/providers/me/availability**
- List all availability slots
- Auth: Required
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "dayOfWeek": 1,
        "startTime": "08:00",
        "endTime": "18:00",
        "isActive": true
      }
    ]
  }
  ```

**PUT /v1/providers/me/availability/:dayOfWeek**
- Update availability for a specific day
- Auth: Required
- Body: `{ startTime, endTime }`
- Response: Updated availability object

---

## 3. Database Schema (API)

### TypeORM Entities

**ServiceCategory**
```typescript
@Entity('service_categories')
export class ServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  icon: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

**ProviderService**
```typescript
@Entity('provider_services')
export class ProviderService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  providerId: string;

  @ManyToOne(() => ServiceCategory)
  @JoinColumn()
  category: ServiceCategory;

  @Column('uuid')
  categoryId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  estimatedDurationMinutes: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerHour: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**ProviderAvailability**
```typescript
@Entity('provider_availability')
export class ProviderAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  providerId: string;

  @Column('int')
  dayOfWeek: number; // 0-6

  @Column('time')
  startTime: string; // HH:mm

  @Column('time')
  endTime: string; // HH:mm

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 4. BFF Layer (Proxy Pattern)

**AuthService** extensions:
```typescript
async getCategories(): Promise<GetCategoriesResult>
async getProviderServices(): Promise<GetProviderServicesResult>
async createProviderService(params: CreateProviderServiceParams): Promise<CreateProviderServiceResult>
async updateProviderService(params: UpdateProviderServiceParams): Promise<UpdateProviderServiceResult>
async deleteProviderService(serviceId: string): Promise<void>
async getProviderAvailability(): Promise<GetProviderAvailabilityResult>
async setProviderAvailability(params: SetProviderAvailabilityParams): Promise<SetProviderAvailabilityResult>
async updateProviderAvailability(params: UpdateProviderAvailabilityParams): Promise<UpdateProviderAvailabilityResult>
```

All methods call `/v1/categories`, `/v1/providers/me/services`, `/v1/providers/me/availability` endpoints.

---

## 5. Mobile UI (Cawme)

### Screens

**ProfileSetupCategoriesScreen**
- Grid of service categories with icons
- Multi-select with checkboxes
- Next button only enabled when ≥1 category selected

**ProfileSetupServicesScreen**
- List of selected categories with "Add Service" button per category
- Collapsible sections per category showing added services
- Modal to add/edit service:
  - Service name input
  - Description textarea
  - Duration picker (hours + minutes)
  - Price per hour input
  - Buttons: Save / Cancel

**ProfileSetupAvailabilityScreen**
- 7 toggles (Mon-Sun) for "I work this day"
- When toggled on, show start/end time pickers
- Display as "Mon: 08:00 - 18:00"
- Toggle off removes time slots

**ProfileSetupReviewScreen**
- Summary of selected categories
- Summary of services added
- Summary of availability
- Complete Profile button

### Navigation Flow
```
[SelectCategories] → [AddServices] → [SetAvailability] → [Review] → Saved
                         ↓
                    [ServiceModal]
```

### State Management (Zustand)
```typescript
interface ProviderProfileStore {
  selectedCategoryIds: string[];
  services: ProviderServiceWithCategory[];
  availability: ProviderAvailabilityByDay;
  
  addCategory: (id: string) => void;
  removeCategory: (id: string) => void;
  addService: (service: ProviderService) => void;
  updateService: (id: string, service: Partial<ProviderService>) => void;
  removeService: (id: string) => void;
  setAvailability: (day: number, start: string, end: string) => void;
  removeAvailability: (day: number) => void;
  reset: () => void;
}
```

---

## 6. Acceptance Criteria

- [ ] API: All 7 endpoints working with proper validation
- [ ] API: Service categories seeded in database
- [ ] BFF: All 8 proxy methods implemented
- [ ] Mobile: All 4 screens implemented
- [ ] Mobile: Zustand store properly persisting data
- [ ] Mobile: E2E flows covering happy path (select categories → add services → set availability → complete)
- [ ] API: Unit tests for service CRUD operations
- [ ] BFF: E2E tests for auth + category/service endpoints
- [ ] Types: All *Params, *Result interfaces in separate files
- [ ] Locales: All UI strings in pt-BR.ts

---

## 7. Implementation Order

**Phase 1 — API Foundation (Day 1)**
1. Create TypeORM entities (ServiceCategory, ProviderService, ProviderAvailability)
2. Implement all 7 use cases (GetCategories, CreateService, etc.)
3. Wire into AuthController
4. Seed categories

**Phase 2 — BFF Integration (Day 1-2)**
1. Create types file with all *Params/*Result
2. Implement 8 proxy methods in AuthService
3. Add endpoints to controller
4. E2E tests

**Phase 3 — Mobile UI (Day 2-3)**
1. Create Zustand store
2. Implement 4 screens
3. Navigation setup
4. Maestro flows for happy path

**Phase 4 — Testing & Polish (Day 3)**
1. Fix any type violations
2. Verify E2E flows
3. Locales sync

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Time picker UX on mobile | Use native time picker for iOS/Android |
| Availability time overlap validation | API-side validation on set/update |
| Service category icons missing | Fallback icon or emoji in UI |

