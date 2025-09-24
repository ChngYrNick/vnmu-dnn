import 'htmx.org';
import 'htmx-ext-preload';
import 'bootstrap/js/dist/offcanvas.js';
import 'bootstrap/js/dist/dropdown.js';
import '../styles/main.scss';
import { VNMUFormContainerComponent } from './form-container.js';

customElements.define(
  VNMUFormContainerComponent.tagName,
  VNMUFormContainerComponent,
);
