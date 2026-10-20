import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Use Leaflet's mutable CommonJS export: markercluster extends this same object.
import L from 'leaflet';
import 'leaflet.markercluster';
import { Excursion } from '../../shared/excursion.model';
import { DIFFICULTIES, DIFFICULTY_ORDER, primaryDifficulty } from '../../shared/difficulty';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="map-shell">
      <div #mapContainer class="map-canvas"></div>
      <div class="map-caption">{{ locatedCount }} eventi in mappa · Tocca un numero per esplorare gli eventi</div>
      <details class="map-legend" aria-label="Legenda difficoltà">
        <summary>Difficoltà e posizioni</summary>
        <ul>
          <li *ngFor="let code of difficultyOrder">
            <span class="legend-dot" [style.background-color]="difficulties[code].color"></span>
            <span class="legend-code">{{ code }}</span>
            <span class="legend-label">{{ difficulties[code].label }}</span>
          </li>
        </ul>
        <p>Le posizioni indicative identificano la zona, non il punto di ritrovo. Verifica sempre la fonte CAI.</p>
      </details>
    </div>
  `,
  styles: [`
    .map-caption { position: absolute; left: 3.4rem; top: .7rem; right: .7rem; z-index: 800; width: fit-content; max-width: calc(100% - 4rem); padding: .4rem .6rem; border-radius: .4rem; background: rgb(255 255 255 / .95); color: #064e3b; font-size: .68rem; box-shadow: 0 1px 8px #123f3420; pointer-events: none; }
    .map-legend summary { cursor: pointer; color: #064e3b; font-size: .75rem; font-weight: 700; }
    .map-legend[open] summary { margin-bottom: .7rem; }
    .map-legend p { max-width: 14rem; margin: .75rem 0 0; color: #57534e; font-size: .68rem; line-height: 1.4; }
    :host {
      display: block;
      flex: 1 1 0;
      min-height: 0;
      min-width: 0;
      width: 100%;
      height: 100%;
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
  @Input() selectedId: string | null = null;
  @Output() selectExcursion = new EventEmitter<Excursion>();

  readonly difficultyOrder = DIFFICULTY_ORDER;
  readonly difficulties = DIFFICULTIES;

  private map!: L.Map;
  private markers = new Map<string, L.Marker>();
  private clusters!: L.MarkerClusterGroup;
  private iconCache = new Map<string, L.DivIcon>();
  private pendingFrame?: number;
  private reflowFrame?: number;
  private selectionFrame?: number;
  private destroyed = false;
  private renderVersion = 0;
  locatedCount = 0;
  private excursionById = new Map<string, Excursion>();
  private highlightedId: string | null = null;
  private resizeObserver?: ResizeObserver;
  private sizeWasInvalid = true;

  ngAfterViewInit() {
    this.initMap();
    if (typeof ResizeObserver === 'undefined') {
      this.scheduleReflow();
      return;
    }
    this.resizeObserver = new ResizeObserver(() => this.onMapResize());
    this.resizeObserver.observe(this.host.nativeElement);
    this.scheduleReflow();
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.renderVersion++;
    if (this.reflowFrame !== undefined) cancelAnimationFrame(this.reflowFrame);
    if (this.selectionFrame !== undefined) cancelAnimationFrame(this.selectionFrame);
    if (this.pendingFrame !== undefined) cancelAnimationFrame(this.pendingFrame);
    this.resizeObserver?.disconnect();
    this.map?.remove();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['excursions']) {
      this.locatedCount = new Set(this.excursions.filter(ex => coordsOf(ex)).map(ex => ex.id)).size;
    }
    if (!this.map) {
      return;
    }
    if (changes['excursions']) {
      this.updateMarkers();
      return;
    }
    if (changes['selectedId']) {
      this.syncSelection(true);
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [42.5, 12.5],
      zoom: 6,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_2jh5_1_ef48f4775a27168b94bfdc64', {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);

    this.clusters = this.createOverlays().addTo(this.map);
    this.updateMarkers();
  }

  private createOverlays(): L.MarkerClusterGroup {
    return L.markerClusterGroup({
      // Screen pixels, not kilometres: keep the overview readable on mobile too.
      maxClusterRadius: zoom => zoom <= 7 ? 80 : zoom <= 11 ? 64 : 48,
      removeOutsideVisibleBounds: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      spiderfyDistanceMultiplier: 1.5,
      animate: false,
      animateAddingMarkers: false,
      iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 44 : count < 100 ? 48 : 54;
        return L.divIcon({
          className: 'event-cluster',
          html: `<span aria-label="${count} eventi vicini. Premi per esplorare">${count}</span>`,
          iconSize: [size, size]
        });
      }
    });
  }

  private updateMarkers(): void {
    const version = ++this.renderVersion;
    if (this.pendingFrame !== undefined) cancelAnimationFrame(this.pendingFrame);
    this.pendingFrame = undefined;
    const next = new Map(this.excursions.filter(ex => coordsOf(ex)).map(ex => [ex.id, ex]));
    const removed: L.Marker[] = [];
    this.markers.forEach((marker, id) => {
      const ex = next.get(id);
      const coords = ex && coordsOf(ex);
      if (!coords || !marker.getLatLng().equals([coords.lat, coords.lng])) {
        removed.push(marker);
        this.markers.delete(id);
      }
    });
    this.clusters.removeLayers(removed);
    this.excursionById = next;
    const pending = [...next.values()];
    let index = 0;

    // Cancellable batches let the browser handle gestures between additions.
    // Built-in chunkedLoading cannot cancel an older filter result in flight.
    const addBatch = () => {
      this.pendingFrame = undefined;
      if (version !== this.renderVersion) return;
      const batch: L.Marker[] = [];
      const started = performance.now();
      while (index < pending.length && batch.length < 200 && performance.now() - started < 8) {
        const ex = pending[index++];
        const tone = primaryDifficulty(ex.category || 'E');
        const selected = ex.id === this.selectedId;
        let marker = this.markers.get(ex.id);
        if (!marker) {
          const coords = coordsOf(ex)!;
          marker = L.marker([coords.lat, coords.lng], {
            icon: this.markerIcon(tone.color, selected),
            title: `${ex.title} (${tone.code})`,
            riseOnHover: true,
            zIndexOffset: selected ? 1000 : 0
          });
          marker.on('click', (event: L.LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(event);
            const current = this.excursionById.get(ex.id);
            if (current) this.selectExcursion.emit(current);
          });
          this.markers.set(ex.id, marker);
        } else {
          marker.setIcon(this.markerIcon(tone.color, selected));
          marker.setZIndexOffset(selected ? 1000 : 0);
          marker.options.title = `${ex.title} (${tone.code})`;
          const element = marker.getElement();
          if (element) element.title = marker.options.title;
        }
        if (!this.clusters.hasLayer(marker)) batch.push(marker);
      }
      this.clusters.addLayers(batch);
      if (index < pending.length) {
        this.pendingFrame = requestAnimationFrame(addBatch);
      } else {
        this.syncSelection(!!this.selectedId);
      }
    };
    this.fitToMarkers();
    addBatch();
  }

  private fitToMarkers(): void {
    if (!this.map) return;
    if (this.excursionById.size > 0) {
      const bounds = L.latLngBounds([...this.excursionById.values()].map(ex => {
        const coords = coordsOf(ex)!;
        return L.latLng(coords.lat, coords.lng);
      }));
      this.map.fitBounds(bounds.pad(0.12), { maxZoom: 12, animate: false });
    } else {
      this.map.setView([42.5, 12.5], 6);
    }
  }

  private hasValidSize(): boolean {
    const size = this.map?.getSize();
    return !!size && size.x > 2 && size.y > 2;
  }

  private onMapResize(): void {
    if (!this.map || this.destroyed) return;
    this.map.invalidateSize();
    const valid = this.hasValidSize();
    if (this.sizeWasInvalid && valid) {
      this.fitToMarkers();
    }
    this.sizeWasInvalid = !valid;
  }

  private scheduleReflow(): void {
    this.reflowFrame = requestAnimationFrame(() => {
      this.reflowFrame = requestAnimationFrame(() => this.onMapResize());
    });
  }

  private syncSelection(pan: boolean): void {
    if (this.selectionFrame !== undefined) cancelAnimationFrame(this.selectionFrame);
    const changedIds = new Set([this.highlightedId, this.selectedId]);
    changedIds.forEach((id) => {
      if (!id) return;
      const excursion = this.excursionById.get(id);
      const marker = this.markers.get(id);
      if (!excursion || !marker) return;
      const selected = id === this.selectedId;
      const tone = primaryDifficulty(excursion.category || 'E');
      marker.setIcon(this.markerIcon(tone.color, selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
    });
    this.highlightedId = this.selectedId;

    if (!pan || !this.selectedId) {
      return;
    }
    const selectedMarker = this.markers.get(this.selectedId);
    if (!selectedMarker) return;
    if (!this.clusters.hasLayer(selectedMarker)) return;
    // zoomToShowLayer already brings it into view. Panning in its callback
    // would immediately collapse spiderfied events at identical coordinates.
    const selectedId = this.selectedId;
    const version = this.renderVersion;
    this.clusters.zoomToShowLayer(selectedMarker, () => {
      // Without cluster animations the plugin may spiderfy during zoomend,
      // then collapse it in a later zoomend listener. Reveal after that event.
      this.selectionFrame = requestAnimationFrame(() => {
        if (this.destroyed || version !== this.renderVersion || this.selectedId !== selectedId) return;
        if (!this.map.hasLayer(selectedMarker)) {
          const parent = this.clusters.getVisibleParent(selectedMarker);
          if (parent instanceof L.MarkerCluster) parent.spiderfy();
        }
      });
    });
  }

  private markerIcon(color: string, selected = false): L.DivIcon {
    const key = `${color}:${selected}`;
    const cached = this.iconCache.get(key);
    if (cached) return cached;
    const size = selected ? 22 : 18;
    const icon = L.divIcon({
      className: `difficulty-marker-wrap${selected ? ' is-selected' : ''}`,
      html: `<span class="difficulty-marker${selected ? ' is-selected' : ''}" style="background:${color}"></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
    this.iconCache.set(key, icon);
    return icon;
  }

}

function coordsOf(excursion: Excursion): { lat: number; lng: number } | null {
  if (excursion.lat == null || excursion.lng == null) return null;
  const lat = Number(excursion.lat);
  const lng = Number(excursion.lng);
  return Number.isFinite(lat) && Number.isFinite(lng)
    && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
}
