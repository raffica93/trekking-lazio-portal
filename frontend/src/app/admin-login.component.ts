import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-card" aria-labelledby="login-title">
        <div class="contour" aria-hidden="true">41° 54′ N · 12° 30′ E</div>
        <img src="logo.png" width="48" height="48" alt="" class="brand-mark">
        <p class="eyebrow">Trekking CAI · amministrazione</p>
        <h1 id="login-title">Aggiorna la mappa.</h1>
        <p class="intro">Accedi per pubblicare luoghi, correggere coordinate e mantenere il portale aggiornato.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label>Email
            <input type="email" autocomplete="email" formControlName="email" placeholder="nome@esempio.it">
          </label>
          <label>Password
            <input type="password" autocomplete="current-password" formControlName="password" placeholder="••••••••">
          </label>
          <p *ngIf="error" class="error" role="alert">{{ error }}</p>
          <p *ngIf="!auth.configured" class="error" role="alert">Manca la configurazione Supabase in <code>public/supabase-config.js</code>.</p>
          <button type="submit" [disabled]="form.invalid || submitting || !auth.configured">
            {{ submitting ? 'Accesso in corso…' : 'Accedi al pannello' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [`
    :host { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; overflow: auto; padding: 1.25rem; background: #1b3b30; color: #173128; }
    .login-page { width: min(100%, 30rem); }
    .login-card { position: relative; overflow: hidden; padding: clamp(2rem, 8vw, 3.4rem); border: 1px solid rgb(212 232 201 / .42); background: #f6f9f1; box-shadow: 17px 17px 0 #9db98d; }
    .login-card::after { position: absolute; right: -5.5rem; bottom: -5.5rem; width: 15rem; height: 15rem; border: 1px solid #a8c39d; border-radius: 50%; content: ''; }
    .contour { position: absolute; top: 1rem; right: 1rem; color: #79967d; font: 700 .58rem/1 'IBM Plex Mono', monospace; letter-spacing: .06em; }
    .brand-mark { position: relative; z-index: 1; display: block; width: 3rem; height: 3rem; margin-bottom: 1.1rem; border-radius: 0.85rem; }
    .eyebrow { margin: 0 0 .65rem; color: #49725b; font: 700 .68rem/1.2 'IBM Plex Mono', monospace; letter-spacing: .08em; text-transform: uppercase; }
    h1 { position: relative; z-index: 1; max-width: 11ch; margin: 0; color: #163d2e; font-size: clamp(2.1rem, 8vw, 3.25rem); line-height: .98; letter-spacing: -.075em; }
    .intro { position: relative; z-index: 1; max-width: 33ch; margin: 1rem 0 1.9rem; color: #526a5c; font-size: .93rem; line-height: 1.5; }
    form { position: relative; z-index: 1; display: grid; gap: .95rem; }
    label { display: grid; gap: .4rem; color: #365444; font-size: .77rem; font-weight: 800; }
    input { width: 100%; box-sizing: border-box; padding: .75rem .8rem; border: 1px solid #b6cbb6; border-radius: .2rem; background: #fff; color: #173128; font: inherit; }
    input:focus { outline: 3px solid rgb(166 202 109 / .55); outline-offset: 1px; }
    button { margin-top: .45rem; padding: .85rem 1rem; border: 0; border-radius: .25rem; background: #1d5c46; color: #f0fad6; font: 800 .82rem/1 Inter, sans-serif; cursor: pointer; }
    button:disabled { cursor: not-allowed; opacity: .58; }
    .error { margin: 0; color: #9a2519; font-size: .78rem; line-height: 1.4; } code { font-family: 'IBM Plex Mono', monospace; }
  `]
})
export class AdminLoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  submitting = false;
  error = '';

  constructor(
    readonly auth: AdminAuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting) return;
    this.error = '';
    this.submitting = true;
    try {
      await this.auth.signIn(this.form.getRawValue().email, this.form.getRawValue().password);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin');
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Impossibile accedere. Riprova.';
    } finally {
      this.submitting = false;
    }
  }
}
