import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { ParametrosService } from 'src/app/core/services/parametro.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {

  email!: string
  loading = false
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private functionsService: FunctionsService,
    private parametrosService: ParametrosService,

  ) {
    this.email = this.route.snapshot.params['email']

    this.authService.verificationEmail(this.email).subscribe((resp: any) => {
      setTimeout(() => {
        this.functionsService.removeItemLocal('email')
        this.functionsService.removeItemLocal('proveedor')
        this.functionsService.removeItemLocal('token')
        this.functionsService.removeItemLocal('uid')
        this.functionsService.removeItemLocal('role')

        this.functionsService.navigateTo('auth/login')
      }, 1500);
    })

  }
}
