import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Excursion } from './excursion.model';
import { DIFFICULTIES, DIFFICULTY_ORDER, primaryDifficulty } from './difficulty';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-shell">
      <div #mapContainer class="map-canvas"></div>
      <aside class="map-legend" aria-label="Legenda difficoltà">
        <ul>
          <li *ngFor="let code of difficultyOrder">
            <span class="legend-dot" [style.background-color]="difficulties[code].color"></span>
            <span class="legend-code">{{ code }}</span>
            <span class="legend-label">{{ difficulties[code].label }}</span>
          </li>
        </ul>
      </aside>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }

    .map-shell {
      position: relative;
      height: 100%;
      width: 100%;
    }

    .map-canvas {
      height: 100%;
      width: 100%;
    }

    .map-legend {
      position: absolute;
      left: 0.75rem;
      bottom: 1.5rem;
      z-index: 1000;
      min-width: 11.5rem;
      padding: 0.7rem 0.8rem;
      border: 1px solid rgb(28 25 23 / 0.12);
      border-radius: 0.6rem;
      background: rgb(255 255 255 / 0.94);
      box-shadow: 0 8px 24px rgb(18 38 28 / 0.12);
      backdrop-filter: blur(8px);
      pointer-events: auto;
    }

    .map-legend ul {
      display: grid;
      gap: 0.4rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .map-legend li {
      display: grid;
      grid-template-columns: 0.7rem 2.1rem 1fr;
      align-items: center;
      gap: 0.45rem;
      color: #1c1917;
      font-size: 11px;
      line-height: 1;
    }

    .legend-dot {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 999px;
      box-shadow: 0 0 0 2px #fff, 0 1px 2px rgb(0 0 0 / 0.25);
    }

    .legend-code {
      font-family: 'IBM Plex Mono', ui-monospace, monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .legend-label {
      color: #57534e;
    }
  `]
})
export class MapComponent implements OnChanges, AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  @ViewChild('mapContainer', { static: true }) private mapContainer!: ElementRef<HTMLDivElement>;
  @Input() excursions: Excursion[] = [];

  readonly difficultyOrder = DIFFICULTY_ORDER;
  readonly difficulties = DIFFICULTIES;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit() {
    this.initMap();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.map.invalidateSize());
    this.resizeObserver.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['excursions'] && this.map) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [41.891, 12.492],
      zoom: 8,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_2jh5_1_ef48f4775a27168b94bfdc64', {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);

    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const located = this.excursions.filter(ex => Number.isFinite(ex.lat) && Number.isFinite(ex.lng));
    const positions = this.spreadOverlapping(located);

    located.forEach((ex, index) => {
      const tone = primaryDifficulty(ex.category);
      const position = positions[index];
      const popup = document.createElement('div');
      popup.className = 'excursion-popup';

      const title = document.createElement('strong');
      title.textContent = ex.title;

      const details = document.createElement('p');
      details.textContent = `${ex.date} · ${ex.location}`;

      popup.append(title, details);
      if (ex.summary) {
        const summary = document.createElement('p');
        summary.textContent = ex.summary;
        popup.append(summary);
      }

      const marker = L.marker(position, {
        icon: this.markerIcon(tone.color),
        title: `${ex.title} (${tone.code})`,
        riseOnHover: true
      })
        .bindPopup(popup)
        .addTo(this.map);

      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.12));
    }
  }

  private markerIcon(color: string): L.DivIcon {
    return L.divIcon({
      className: 'difficulty-marker-wrap',
      html: `<span class="difficulty-marker" style="background:${color}"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -12]
    });
  }

  private spreadOverlapping(excursions: Excursion[]): L.LatLngExpression[] {
    const seen = new Map<string, number>();

    return excursions.map((ex) => {
      const key = `${ex.lat.toFixed(4)},${ex.lng.toFixed(4)}`;
      const count = seen.get(key) ?? 0;
      seen.set(key, count + 1);
      if (count === 0) {
        return [ex.lat, ex.lng];
      }

      const angle = (count * 137.508) * Math.PI / 180;
      const distance = 0.014 * Math.ceil(count / 5);
      return [
        ex.lat + Math.sin(angle) * distance,
        ex.lng + Math.cos(angle) * distance
      ];
    });
  }
}
