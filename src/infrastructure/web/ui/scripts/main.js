import 'htmx.org';
import 'htmx-ext-preload';
import '../styles/main.css';
import { VNMUFormContainerComponent } from './form-container.js';

// Prevent hx-boost from intercepting file downloads (PDF, docs, etc.)
document.addEventListener('htmx:beforeRequest', (event) => {
  const elt = event.detail.elt;
  if (elt.tagName !== 'A') return;
  const href = elt.getAttribute('href') || '';
  if (
    /\.(pdf|docx?|xlsx?|pptx?|zip|rar|png|jpe?g|gif|svg|mp[34])$/i.test(href)
  ) {
    event.preventDefault();
    window.open(href, '_blank');
  }
});

customElements.define(
  VNMUFormContainerComponent.tagName,
  VNMUFormContainerComponent,
);
