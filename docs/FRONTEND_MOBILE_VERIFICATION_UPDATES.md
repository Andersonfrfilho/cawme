# Frontend Mobile Verification Updates

## Overview

Este documento descreve as mudanças necessárias no app mobile (iOS/Android) para suportar a nova funcionalidade de verificação de e-mail e telefone com:
- Expiração estruturada de códigos (5 minutos)
- Auto-capture de códigos via SMS
- Contador de expiração em tempo real
- Suporte simultâneo para email e SMS

---

## TypeScript Types

```typescript
export type VerificationChannel = 'email' | 'phone';

export interface ExpirationInfo {
  value: number;
  unit: 'minutos' | 'horas' | 'segundos';
}

export interface SendVerificationCodeResponse {
  success: boolean;
  message: string;
  codeId: string;
  expiresIn: ExpirationInfo;
  expiresAt: string; // localized format: "28/05/2026 11:41"
  destination: string;
  type: VerificationChannel;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface VerificationState {
  type: VerificationChannel;
  destination: string;
  codeId: string;
  code: string;
  expiresAt: Date;
  isExpired: boolean;
}
```

---

## Implementation Guide

### 1. Verification Service

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VerificationService {
  private readonly API_BASE = '/api/v1/auth';
  private verificationState$ = new BehaviorSubject<VerificationState | null>(null);

  constructor(private http: HttpClient) {}

  sendVerificationCode(
    type: VerificationChannel,
    destination: string
  ): Observable<SendVerificationCodeResponse> {
    return this.http.post<SendVerificationCodeResponse>(
      `${this.API_BASE}/send-verification-code`,
      { type, destination }
    );
  }

  verifyCode(codeId: string, code: string): Observable<VerifyCodeResponse> {
    return this.http.post<VerifyCodeResponse>(
      `${this.API_BASE}/verify-code`,
      { codeId, code }
    );
  }

  getVerificationState(): Observable<VerificationState | null> {
    return this.verificationState$.asObservable();
  }

  setVerificationState(state: VerificationState): void {
    this.verificationState$.next(state);
  }

  clearVerificationState(): void {
    this.verificationState$.next(null);
  }
}
```

### 2. Verification Countdown Component

```typescript
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-verification-countdown',
  template: `
    <div class="countdown">
      <div class="timer" [class.expired]="isExpired">
        <svg class="timer-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="6" x2="12" y2="12" />
          <line x1="12" y1="12" x2="16" y2="16" />
        </svg>
        <span>{{ remainingTime }}</span>
      </div>
      <p class="expire-text" *ngIf="!isExpired">
        Este código expira em {{ remainingTime }}
      </p>
      <p class="expire-text expired" *ngIf="isExpired">
        Código expirado. Solicite um novo.
      </p>
    </div>
  `,
  styles: [`
    .countdown {
      text-align: center;
      margin: 16px 0;
    }
    .timer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 24px;
      font-weight: bold;
      color: #1a45e8;
      transition: color 0.3s;
    }
    .timer.expired {
      color: #dc2626;
    }
    .timer-icon {
      width: 32px;
      height: 32px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
    }
    .expire-text {
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
    .expire-text.expired {
      color: #dc2626;
    }
  `]
})
export class VerificationCountdownComponent implements OnInit, OnDestroy {
  @Input() expiresAt: Date;

  remainingTime: string = '';
  isExpired = false;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.updateCountdown();
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateCountdown());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateCountdown() {
    const now = new Date();
    const diff = this.expiresAt.getTime() - now.getTime();

    if (diff <= 0) {
      this.isExpired = true;
      this.remainingTime = '0s';
      return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (minutes > 0) {
      this.remainingTime = `${minutes}m ${seconds}s`;
    } else {
      this.remainingTime = `${seconds}s`;
    }
  }
}
```

### 3. Verification Screen Component

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verification-screen',
  template: `
    <div class="verification-container">
      <h1>Verificar Identidade</h1>
      
      <!-- Tab Selection: Email or Phone -->
      <div class="tabs">
        <button 
          [class.active]="verificationMethod === 'email'"
          (click)="switchMethod('email')">
          📧 E-mail
        </button>
        <button 
          [class.active]="verificationMethod === 'phone'"
          (click)="switchMethod('phone')">
          📱 Telefone
        </button>
      </div>

      <!-- Step 1: Request Code -->
      <div *ngIf="currentStep === 'request-code'" class="step">
        <p>Enviaremos um código de 4 dígitos para:</p>
        <input 
          type="text" 
          [(ngModel)]="destination"
          placeholder="E-mail ou telefone"
          [disabled]="isLoading" />
        <button 
          (click)="requestCode()"
          [disabled]="isLoading || !destination">
          {{ isLoading ? 'Enviando...' : 'Enviar Código' }}
        </button>
        <p class="error" *ngIf="error">{{ error }}</p>
      </div>

      <!-- Step 2: Verify Code -->
      <div *ngIf="currentStep === 'verify-code'" class="step">
        <app-verification-countdown 
          [expiresAt]="expiresAt"></app-verification-countdown>
        
        <p>Código enviado para {{ destination }}</p>
        
        <!-- Code Input Field -->
        <input 
          type="text" 
          [(ngModel)]="code"
          placeholder="0000"
          maxlength="4"
          [disabled]="isLoading || isCodeExpired"
          (keyup.enter)="verifyCode()" />
        
        <!-- SMS Auto-Capture Indicator (iOS/Android) -->
        <p class="auto-capture-hint" *ngIf="verificationMethod === 'phone'">
          💡 Seu código será preenchido automaticamente quando a mensagem chegar
        </p>

        <button 
          (click)="verifyCode()"
          [disabled]="isLoading || isCodeExpired || !code">
          {{ isLoading ? 'Verificando...' : 'Verificar' }}
        </button>

        <button 
          (click)="requestNewCode()"
          class="secondary">
          Reenviar Código
        </button>

        <p class="error" *ngIf="error">{{ error }}</p>
      </div>

      <!-- Step 3: Success -->
      <div *ngIf="currentStep === 'success'" class="step success">
        <p>✅ Verificado com sucesso!</p>
        <button (click)="navigateNext()">Continuar</button>
      </div>
    </div>
  `,
  styles: [`
    .verification-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 24px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .tabs {
      display: flex;
      gap: 8px;
      margin: 24px 0;
    }
    .tabs button {
      flex: 1;
      padding: 12px;
      border: 2px solid #e5e7eb;
      background: #fff;
      border-radius: 8px;
      cursor: pointer;
    }
    .tabs button.active {
      border-color: #1a45e8;
      background: #f0f4ff;
      color: #1a45e8;
    }
    .step {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    input {
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
    }
    button {
      padding: 12px;
      background: #1a45e8;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    button.secondary {
      background: #6b7280;
    }
    .error {
      color: #dc2626;
      font-size: 14px;
    }
    .auto-capture-hint {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px;
      border-radius: 4px;
      font-size: 13px;
      color: #78350f;
    }
    .success {
      text-align: center;
    }
  `]
})
export class VerificationScreenComponent implements OnInit {
  verificationMethod: VerificationChannel = 'email';
  currentStep: 'request-code' | 'verify-code' | 'success' = 'request-code';
  
  destination = '';
  code = '';
  isLoading = false;
  error = '';
  expiresAt: Date | null = null;
  isCodeExpired = false;

  form: FormGroup;

  constructor(
    private verification: VerificationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['method']) {
        this.verificationMethod = params['method'];
      }
    });
  }

  switchMethod(method: VerificationChannel) {
    this.verificationMethod = method;
    this.currentStep = 'request-code';
    this.code = '';
    this.error = '';
  }

  requestCode() {
    this.isLoading = true;
    this.error = '';

    this.verification.sendVerificationCode(this.verificationMethod, this.destination)
      .subscribe({
        next: (response) => {
          this.expiresAt = new Date(response.expiresAt);
          this.currentStep = 'verify-code';
          this.isLoading = false;
          this.setupAutoCapture();
        },
        error: (err) => {
          this.error = err.error?.message || 'Erro ao enviar código';
          this.isLoading = false;
        }
      });
  }

  verifyCode() {
    if (!this.code || this.code.length !== 4) {
      this.error = 'Digite um código válido';
      return;
    }

    this.isLoading = true;
    this.error = '';

    // Get codeId from state (saved when requesting code)
    const state = this.verification.getVerificationState();
    // ... get codeId from state

    this.verification.verifyCode(codeId, this.code)
      .subscribe({
        next: () => {
          this.currentStep = 'success';
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Código inválido';
          this.isLoading = false;
        }
      });
  }

  requestNewCode() {
    this.code = '';
    this.currentStep = 'request-code';
    this.requestCode();
  }

  private setupAutoCapture() {
    if (this.verificationMethod === 'phone') {
      // Android: SmsRetriever setup
      if (this.isAndroid()) {
        this.startAndroidSmsRetriever();
      }
      // iOS: Auto-capture happens automatically via One Time Codes
    }
  }

  private startAndroidSmsRetriever() {
    // Chamar native plugin do Capacitor/React Native para ativar SmsRetriever
    // Veja seção "Android SmsRetriever" abaixo
  }

  private isAndroid(): boolean {
    return /android/i.test(navigator.userAgent);
  }

  navigateNext() {
    this.router.navigate(['/dashboard']);
  }
}
```

---

## Android: SMS Auto-Capture com SmsRetriever

### Setup

#### 1. Adicione dependência no `build.gradle`

```gradle
dependencies {
  implementation 'com.google.android.gms:play-services-auth:20.7.0'
  implementation 'com.google.android.gms:play-services-auth-api-phone:17.6.0'
}
```

#### 2. Obtenha o App Signing Certificate Hash

```bash
# Para release build (produção)
keytool -list -v -keystore /path/to/your/release.keystore

# Procure pela linha "SHA-1" e copie apenas os últimos 11 caracteres
# Exemplo: "3A:5C:8D..." → use apenas "3A5C8D..."
```

#### 3. Implementação (Capacitor)

```typescript
import { Plugin, registerPlugin } from '@capacitor/core';

export interface SmsRetrieverPlugin {
  startListening(): Promise<{ code: string }>;
  stopListening(): Promise<void>;
}

const SmsRetriever = registerPlugin<SmsRetrieverPlugin>('SmsRetriever');

export async function setupAndroidSmsRetriever(): Promise<string | null> {
  try {
    const result = await SmsRetriever.startListening();
    // Extrai apenas os 4 dígitos do SMS
    const codeMatch = result.code.match(/#(\d{4})/);
    return codeMatch ? codeMatch[1] : null;
  } catch (error) {
    console.error('SMS Retriever failed:', error);
    return null;
  }
}
```

#### 4. Native Plugin Implementation (Android/Kotlin)

Crie em `android/app/src/main/kotlin/com/domestic/SmsRetrieverPlugin.kt`:

```kotlin
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "SmsRetriever")
class SmsRetrieverPlugin : Plugin() {
  private var smsRetrieverReceiver: SmsBroadcastReceiver? = null

  @PluginMethod
  fun startListening(call: PluginCall) {
    val client = SmsRetriever.getClient(activity)
    val task = client.startSmsRetriever()

    task.addOnSuccessListener {
      smsRetrieverReceiver = SmsBroadcastReceiver()
      smsRetrieverReceiver!!.setCall(call)
      
      val intentFilter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.registerReceiver(smsRetrieverReceiver, intentFilter, Context.RECEIVER_EXPORTED)
      } else {
        context.registerReceiver(smsRetrieverReceiver, intentFilter)
      }
    }

    task.addOnFailureListener {
      call.reject("Failed to start SMS Retriever")
    }
  }

  @PluginMethod
  fun stopListening(call: PluginCall) {
    if (smsRetrieverReceiver != null) {
      context.unregisterReceiver(smsRetrieverReceiver)
      smsRetrieverReceiver = null
    }
    call.resolve()
  }

  inner class SmsBroadcastReceiver : BroadcastReceiver() {
    private lateinit var call: PluginCall

    fun setCall(call: PluginCall) {
      this.call = call
    }

    override fun onReceive(context: Context, intent: Intent) {
      if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.action) {
        val extras = intent.extras
        val status = extras?.get(SmsRetriever.EXTRA_STATUS) as? Status

        when (status?.statusCode) {
          CommonStatusCodes.SUCCESS -> {
            val message = extras?.get(SmsRetriever.EXTRA_SMS_MESSAGE) as? String
            if (message != null) {
              val result = JSObject()
              result.put("code", message)
              call.resolve(result)
              context.unregisterReceiver(this)
            }
          }
          CommonStatusCodes.TIMEOUT -> {
            call.reject("SMS Retriever timeout")
            context.unregisterReceiver(this)
          }
        }
      }
    }
  }
}
```

---

## iOS: SMS Auto-Capture com One Time Codes

### Setup

#### 1. Adicione a capability no Xcode

- Abra seu projeto no Xcode
- Vá para **Signing & Capabilities**
- Clique em **+ Capability**
- Procure por **Associated Domains** e adicione
- Em Associated Domains, adicione: `webcredentials:domestic.com.br`

#### 2. Crie um `.well-known/apple-app-site-association` no seu servidor

No domínio `domestic.com.br`, crie:

```json
{
  "webcredentials": {
    "apps": [
      "TEAMID.com.domestic.app"
    ]
  }
}
```

Onde `TEAMID` é seu Team ID da Apple.

#### 3. Implementação (Swift)

```swift
import AuthenticationServices

class VerificationViewController: UIViewController {
  @IBOutlet weak var codeTextField: UITextField!

  override func viewDidLoad() {
    super.viewDidLoad()
    setupCodeAutofill()
  }

  private func setupCodeAutofill() {
    // iOS 12+: Detecta automaticamente códigos em SMS
    if #available(iOS 12.0, *) {
      codeTextField.textContentType = .oneTimeCode
    }
    
    // iOS 16+: Usa autofill direto (mais suave)
    if #available(iOS 16.0, *) {
      codeTextField.autofillContentType = .oneTimeCode
    }
  }
}
```

---

## Formato do SMS Esperado

O backend envia SMS com este formato:

```
Seu código de verificação Domestic: 1234
Válido por 5 minutos.
Nunca compartilhe este código.

@domestic.com.br #1234
```

**O que cada parte faz:**
- `Seu código de verificação...` — Mensagem legível para o usuário
- `@domestic.com.br` — Identificação do domínio (Android SmsRetriever)
- `#1234` — Código em formato padrão (iOS One Time Codes detecta automaticamente)

---

## Testes

### Teste Local (iOS)

1. No Simulator, envie SMS via:
   ```bash
   xcrun simctl sms send booted 1234567890 "Seu código: 1234\n\n@domestic.com.br #1234"
   ```
2. O código deve aparecer automaticamente no campo

### Teste Local (Android)

1. Use Android Studio Emulator
2. Vá para Extended controls (⋯ menu)
3. Clique em **Phone**
4. Envie SMS com conteúdo acima
5. O SmsRetriever vai capturar automaticamente

### Teste em Produção

1. Faça uma requisição de código real
2. Aguarde o SMS chegar
3. Verifique se o código é preenchido automaticamente (quando estiver em focus)

---

## Implementação Timeline

### Fase 1: Setup Base (1 dia)
- [ ] Adicionar tipos TypeScript
- [ ] Implementar VerificationService
- [ ] Implementar VerificationScreen (step 1: request code)

### Fase 2: Verificação Manual (1 dia)
- [ ] Implementar input de código
- [ ] Implementar VerificationCountdown
- [ ] Implementar verifyCode() logic
- [ ] Testar fluxo manual end-to-end

### Fase 3: Android Auto-Capture (2 dias)
- [ ] Adicionar plugin SmsRetriever
- [ ] Integrar com VerificationScreen
- [ ] Testar em Android device/emulator

### Fase 4: iOS Auto-Capture (1 dia)
- [ ] Configurar Associated Domains
- [ ] Definir apple-app-site-association
- [ ] Testar em iOS device/simulator

### Fase 5: Polish & Deploy (1 dia)
- [ ] Testes E2E
- [ ] Error handling refinement
- [ ] Beta deploy

---

## Notas Importantes

### Expiração de Código

- **TTL no backend:** 5 minutos
- **Formato de resposta:** `{ value: 5, unit: "minutos" }`
- **Cliente deve validar:** Se o countdown atingir 0, desabilitar botão de verificação
- **Servidor vai rejeitar:** Códigos expirados com erro `VERIFICATION_CODE_EXPIRED`

### SMS vs Email

- **SMS:** Auto-capture via SmsRetriever (Android) ou One Time Codes (iOS)
- **Email:** Usuário digita manualmente (copia do email para o app)
- **Ambos suportados:** Mesmo tipo de UI, seletor de método no topo

### Segurança

- Nunca armazene código em SharedPreferences/UserDefaults sem encryption
- Limpe o código da memória após verificação bem-sucedida
- Use HTTPS para toda comunicação
- Validar o domínio do SMS (`@domestic.com.br`) antes de confiar

### Tratamento de Erros

```typescript
// Possíveis erros da API
{
  "code": "VERIFICATION_CODE_EXPIRED",
  "message": "Este código expirou"
}

{
  "code": "VERIFICATION_CODE_INVALID",
  "message": "Código incorreto"
}

{
  "code": "VERIFICATION_CODE_NOT_FOUND",
  "message": "Código não encontrado"
}

{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Muitas tentativas, tente novamente em 5 minutos"
}
```
