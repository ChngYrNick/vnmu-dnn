import 'htmx.org';
import '../styles/admin.css';
import 'easymde/dist/easymde.min.css';
import { VNMUEditorComponent } from './editor.js';
import { VNMUFileUploaderComponent } from './file-uploader.js';
import { VNMUFileUploaderHostComponent } from './file-uploader-host.js';

// Clean up open dialogs before HTMX swaps content
document.addEventListener('htmx:beforeSwap', () => {
  document.querySelectorAll('dialog[open]').forEach((dialog) => {
    dialog.close();
  });
});

// Event delegation for opening/closing dialogs
document.addEventListener('click', (e) => {
  const openBtn = e.target.closest('[data-open-dialog]');
  if (openBtn) {
    const dialog = document.getElementById(openBtn.dataset.openDialog);
    if (dialog) dialog.showModal();
  }
  const closeBtn = e.target.closest('[data-close-dialog]');
  if (closeBtn) {
    closeBtn.closest('dialog')?.close();
  }
});

customElements.define(VNMUEditorComponent.tagName, VNMUEditorComponent);
customElements.define(
  VNMUFileUploaderComponent.tagName,
  VNMUFileUploaderComponent,
);
customElements.define(
  VNMUFileUploaderHostComponent.tagName,
  VNMUFileUploaderHostComponent,
);
