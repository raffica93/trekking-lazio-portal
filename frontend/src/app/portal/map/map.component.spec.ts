import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import L from 'leaflet';
import { MapComponent } from './map.component';
import { Excursion } from '../../shared/excursion.model';

const excursion = (id: string, lat = 42, lng = 12): Excursion => ({
  id, lat, lng, title: `Uscita ${id}`, category: 'E', date: '2026-12-01',
  link: 'https://cai.it', organizer: 'CAI', location: 'Monte', cost: '', time: ''
});

describe('Map clustering', () => {
  let frames: Map<number, FrameRequestCallback>;
  let frameId: number;

  beforeEach(() => {
    frames = new Map();
    frameId = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
    TestBed.configureTestingModule({ imports: [MapComponent] });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  function flushFrames() {
    for (let i = 0; frames.size && i < 100; i++) {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach(callback => callback(performance.now()));
    }
    expect(frames.size).toBe(0);
  }

  function create(events: Excursion[]) {
    const fixture = TestBed.createComponent(MapComponent);
    const canvas = fixture.nativeElement.querySelector('.map-canvas');
    Object.defineProperties(canvas, {
      clientWidth: { value: 800 }, clientHeight: { value: 600 }
    });
    fixture.componentRef.setInput('excursions', events);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('loads the real cluster plugin and shows counted groups instead of all pins', () => {
    const { component, fixture } = create(Array.from({ length: 100 }, (_, i) => excursion(`${i}`)));
    flushFrames();
    expect(component['clusters']).toBeInstanceOf(L.MarkerClusterGroup);
    expect(component['clusters'].getLayers()).toHaveLength(100);
    const clusters = fixture.nativeElement.querySelectorAll('.event-cluster');
    expect(clusters).toHaveLength(1);
    expect(clusters[0].textContent).toBe('100');
    expect(fixture.nativeElement.querySelectorAll('.difficulty-marker')).toHaveLength(0);
    const radius = (component['clusters'].options as L.MarkerClusterGroupOptions).maxClusterRadius as (zoom: number) => number;
    expect(radius(6)).toBeGreaterThan(radius(12));
  });

  it('keeps all 3000 events while rendering fewer than 100 map icons', () => {
    const events = Array.from({ length: 3000 }, (_, i) =>
      excursion(`${i}`, 42 + (i % 50) * .003, 12 + Math.floor(i / 50) * .003));
    const { component, fixture } = create(events);
    flushFrames();
    expect(component['clusters'].getLayers()).toHaveLength(3000);
    const counts = [...fixture.nativeElement.querySelectorAll('.event-cluster')]
      .map((element: any) => Number(element.textContent));
    const singles = fixture.nativeElement.querySelectorAll('.difficulty-marker').length;
    expect(counts.reduce((sum, count) => sum + count, singles)).toBe(3000);
    expect(counts.length + singles).toBeLessThan(100);
  });

  it('reuses existing markers and emits current event details after a filter update', () => {
    const original = excursion('a');
    const { fixture, component } = create([original, excursion('b')]);
    flushFrames();
    const marker = component['markers'].get('a')!;
    const updated = { ...original, title: 'Titolo aggiornato', category: 'EE' };
    fixture.componentRef.setInput('excursions', [updated]);
    fixture.detectChanges();
    flushFrames();
    expect(component['markers'].get('a')).toBe(marker);
    expect(component['clusters'].getLayers()).toEqual([marker]);
    expect(component.locatedCount).toBe(1);
    const emit = vi.spyOn(component.selectExcursion, 'emit');
    marker.fire('click', { originalEvent: new MouseEvent('click') });
    expect(emit).toHaveBeenCalledWith(updated);
  });

  it('cancels unfinished batches when filters change and excludes invalid coordinates', () => {
    const { fixture, component } = create(Array.from({ length: 1500 }, (_, i) => excursion(`${i}`)));
    expect(component['clusters'].getLayers().length).toBeLessThan(1500);
    fixture.componentRef.setInput('excursions', [excursion('new'), excursion('invalid', 100), excursion('missing', NaN)]);
    fixture.detectChanges();
    flushFrames();
    expect(component['clusters'].getLayers()).toHaveLength(1);
    expect([...component['markers'].keys()]).toEqual(['new']);
    expect(component.locatedCount).toBe(1);
  });

  it('reveals an event selected from the list even when its coordinates overlap', async () => {
    const { fixture, component } = create([excursion('a'), excursion('b')]);
    flushFrames();
    fixture.componentRef.setInput('selectedId', 'b');
    fixture.detectChanges();
    flushFrames();
    await new Promise(resolve => setTimeout(resolve, 400));
    flushFrames();
    const selected = component['markers'].get('b')!;
    expect(component['map'].hasLayer(selected)).toBe(true);
    expect(selected.getElement()?.classList.contains('is-selected')).toBe(true);
  });

  it('cancels pending work when the map is destroyed', () => {
    const { fixture, component } = create(Array.from({ length: 1500 }, (_, i) => excursion(`${i}`)));
    const additions = vi.spyOn(component['clusters'], 'addLayers');
    fixture.destroy();
    flushFrames();
    expect(additions).not.toHaveBeenCalled();
  });
});
