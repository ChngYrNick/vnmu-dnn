import 'htmx.org';
import '../styles/main.scss';
import '../styles/admin.scss';
import 'easymde/dist/easymde.min.css';
import { VNMUEditorComponent } from './editor.js';
import { VNMUFileUploaderComponent } from './file-uploader.js';

addEventListener('load', () => {
  customElements.define(VNMUEditorComponent.tagName, VNMUEditorComponent);
  customElements.define(
    VNMUFileUploaderComponent.tagName,
    VNMUFileUploaderComponent,
  );
});
