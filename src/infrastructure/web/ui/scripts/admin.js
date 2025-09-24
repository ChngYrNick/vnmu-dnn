import 'htmx.org';
import '../styles/admin.scss';
import 'easymde/dist/easymde.min.css';
import 'bootstrap/js/dist/modal.js';
import { VNMUEditorComponent } from './editor.js';
import { VNMUFileUploaderComponent } from './file-uploader.js';
import { VNMUFileUploaderHostComponent } from './file-uploader-host.js';

customElements.define(VNMUEditorComponent.tagName, VNMUEditorComponent);
customElements.define(
  VNMUFileUploaderComponent.tagName,
  VNMUFileUploaderComponent,
);
customElements.define(
  VNMUFileUploaderHostComponent.tagName,
  VNMUFileUploaderHostComponent,
);
