import {Component, OnInit} from "@angular/core";
import {AuthManager} from "./services/auth-manager.service";
import {Router, NavigationStart, RoutesRecognized, NavigationCancel, NavigationEnd, NavigationError} from "@angular/router";
import {TranslationService} from "./services/translation.service";
import {User} from "./models/user";

@Component({
  moduleId: module.id,
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"]
})
export class AppComponent implements OnInit {
  user: User;
  isNavigationMenuVisible: boolean = false;

  constructor(private authManager: AuthManager, private router: Router, public translationService: TranslationService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigationMenuVisible = false;
      }

      if (event instanceof NavigationEnd) {
        console.log('NavigationEnd');
      }

      if (event instanceof NavigationCancel) {
        console.log('NavigationCancel');
      }

      if (event instanceof NavigationError) {
        console.log('NavigationError', event);
      }

      if (event instanceof RoutesRecognized) {
        console.log('RoutesRecognized');
      }
    });
  }

  ngOnInit() {
    console.log("Application component initialized ...");
    this.authManager.authenticateIfNeeded().then(result => {
      if (result == null) {
        this.router.navigate(['/home']);
        return;
      }
      this.router.initialNavigation();
    });
    this.user = this.authManager.getUser();
  }

  onBodyClick(event) {
    let targetClasses = event.target.classList;
    if ((targetClasses.contains('overbody-container') || targetClasses.contains('menu-side-bar')) && this.isNavigationMenuVisible) {
      this.isNavigationMenuVisible = false;
    }
  }

  onMenuButtonClick() {
    this.isNavigationMenuVisible = true;
  }
}


