import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationModule } from '../authentication/authentication.module';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  user: string;

  constructor(private breakpointObserver: BreakpointObserver, public authenticationModule: AuthenticationModule) {
    this.user = 'Not Logged in';
    authenticationModule.LoggedIn.subscribe((s) => {
      if (s) {
        this.user = `${s.firstname || ''} ${s.lastname || ''}`;
      } else {
        this.user = 'Not Logged in';
      }
    });
  }
  connectToStrava() {
    console.log('connectToStrava');
    this.authenticationModule.connectToStrava();
  }

  Logout() {
    this.authenticationModule.Logout();
  }
}
