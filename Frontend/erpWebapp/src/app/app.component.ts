import { Component } from '@angular/core';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importando o arquivo do plugin Bootstrap
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'erpWebapp';
}
