import { Component, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Excursion } from './excursion.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="map" class="h-full w-full rounded-lg shadow-md border"></div>`
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() excursions: Excursion[] = [];
  private map!: L.Map;
  private markers: L.Marker[] = [];

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['excursions'] && this.map) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [41.891, 12.492], // Rome
      zoom: 8
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    
    this.updateMarkers();
  }

  private updateMarkers(): void {
    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    this.excursions.forEach(ex => {
      const marker = L.marker([ex.lat, ex.lng])
        .bindPopup(`<b>${ex.title}</b><br>${ex.date}<br>${ex.organizer}`)
        .addTo(this.map);
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
