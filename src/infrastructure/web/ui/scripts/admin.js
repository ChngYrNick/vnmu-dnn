import 'htmx.org';
import '../styles/main.scss';
import '../styles/admin.scss';
import 'easymde/dist/easymde.min.css';
import { VNMUEditorComponent } from './editor.js';
import { VNMUFileUploaderComponent } from './file-uploader.js';
import { VNMUFileUploaderHostComponent } from './file-uploader-host.js';
// eslint-disable-next-line
import { Modal } from 'bootstrap';

addEventListener('load', () => {
  customElements.define(VNMUEditorComponent.tagName, VNMUEditorComponent);
  customElements.define(
    VNMUFileUploaderComponent.tagName,
    VNMUFileUploaderComponent,
  );
  customElements.define(
    VNMUFileUploaderHostComponent.tagName,
    VNMUFileUploaderHostComponent,
  );
});
