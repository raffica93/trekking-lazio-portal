import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <section class="admin-shell">
      <header class="admin-header">
        <a routerLink="/admin" class="brand" aria-label="Torna all'archivio luoghi">
          <img src="logo.png" width="40" height="40" alt="" class="brand-mark">
          <span>
            <strong>Trekking Lazio</strong>
            <small>Base cartografica</small>
          </span>
        </a>
        <nav aria-label="Navigazione amministratore">
          <a routerLink="/admin" class="quiet-link">Luoghi</a>
          <a routerLink="/admin/sedi" class="quiet-link">Sedi CAI</a>
          <a routerLink="/" class="quiet-link">Portale pubblico</a>
          <button type="button" class="sign-out" (click)="signOut()">Esci</button>
        </nav>
      </header>
      <main class="admin-main">
        <router-outlet />
      </main>
    </section>
  `,
  styles: [`
    :host { position: fixed; inset: 0; z-index: 2000; display: block; overflow: auto; background: #eef3eb; color: #183229; }
    .admin-shell { min-height: 100%; background-image: linear-gradient(90deg, rgb(24 50 41 / .05) 1px, transparent 1px), linear-gradient(rgb(24 50 41 / .05) 1px, transparent 1px); background-size: 26px 26px; }
    .admin-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem clamp(1rem, 4vw, 4rem); border-bottom: 1px solid #b4c9b6; background: rgb(250 252 248 / .94); backdrop-filter: blur(12px); }
    .brand { display: flex; align-items: center; gap: .75rem; color: inherit; text-decoration: none; }
    .brand-mark { width: 2.35rem; height: 2.35rem; border-radius: 0.7rem; }
    .brand strong, .brand small { display: block; }
    .brand strong { font-size: 1rem; letter-spacing: -.025em; }
    .brand small { margin-top: .1rem; color: #577067; font: 600 .66rem/1.2 'IBM Plex Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
    nav { display: flex; align-items: center; gap: .75rem; }
    .quiet-link, .sign-out { border: 0; background: none; color: #315a49; font: 700 .8rem/1 Inter, sans-serif; text-decoration: none; cursor: pointer; }
    .sign-out { padding: .58rem .75rem; border: 1px solid #a8bfaa; border-radius: .4rem; }
    .admin-main { width: min(1160px, calc(100% - 2rem)); margin: 2rem auto 4rem; }
    @media (max-width: 540px) { .admin-header { align-items: flex-start; flex-direction: column; } nav { width: 100%; justify-content: space-between; } }
  `]
})
export class AdminShellComponent {
  constructor(private readonly auth: AdminAuthService, private readonly router: Router) {}

  async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/admin/login');
  }
}
