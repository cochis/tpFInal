import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  ver = environment.version
  ADM = environment.admin_role
  SLN = environment.salon_role
  URS = environment.user_role
  ANF = environment.anf_role
  CHK = environment.chk_role
  url = environment.base_url
  rol = this.functionsService.getLocal('role')

  constructor(private functionsService: FunctionsService) {

  }

}
