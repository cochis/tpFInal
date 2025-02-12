/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

if (!navigator.geolocation) {
  throw new Error('Navegador no soporta la geolocalización')
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
Mapboxgl.accessToken = 'pk.eyJ1IjoiY29jaGlzIiwiYSI6ImNsb2c0M3NxNDByazEya3Jydmc2amtrNTcifQ.j0MCmbfTjEUQMtby7r42Cw';
