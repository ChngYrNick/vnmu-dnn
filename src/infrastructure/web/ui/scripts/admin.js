import 'htmx.org';
import '../styles/admin.scss';
import 'easymde/dist/easymde.min.css';
import { Modal } from 'bootstrap/js/dist/modal.js';
import { VNMUEditorComponent } from './editor.js';
import { VNMUFileUploaderComponent } from './file-uploader.js';
import { VNMUFileUploaderHostComponent } from './file-uploader-host.js';

// Clean up Bootstrap modal scroll lock before HTMX swaps content
document.addEventListener('htmx:beforeSwap', () => {
  // Hide any open modals and clean up their scroll lock
  document.querySelectorAll('.modal.show').forEach((modalEl) => {
    const modal = Modal.getInstance(modalEl);
    if (modal) {
      modal.hide();
    }
  });
  // Remove any leftover modal artifacts
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
  document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
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
