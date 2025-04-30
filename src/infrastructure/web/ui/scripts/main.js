import 'htmx.org';
import 'htmx-ext-preload';
// eslint-disable-next-line
import { Offcanvas, Dropdown } from 'bootstrap';

import '../styles/main.scss';
import { VNMUFormContainerComponent } from './form-container.js';

addEventListener('load', () => {
  customElements.define(
    VNMUFormContainerComponent.tagName,
    VNMUFormContainerComponent,
  );
});
