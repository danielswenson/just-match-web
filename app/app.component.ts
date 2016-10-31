import {Component, OnInit} from "@angular/core";
import {AuthManager} from "./services/auth-manager.service";
import {Router, NavigationStart, RoutesRecognized, NavigationCancel, NavigationEnd, NavigationError} from "@angular/router";
import {Location} from '@angular/common';
import {User} from "./models/user";
import {TranslationService} from "./services/translation.service";
import {Language} from "./models/language";

@Component({
  moduleId: module.id,
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"]
})
export class AppComponent implements OnInit {
  states: Array<String> = new Array<String>();
  currentState: string;
  user: User;
  systemLanguages: Array<Language>;
  selectedLanguage: Language;
  isNavigationMenuVisible: boolean = false;
  isLanguageMenuVisible: boolean = false;

  constructor(private router: Router, private authManager: AuthManager, private location: Location, public translationService: TranslationService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigationMenuVisible = false;
      }

      if (event instanceof NavigationEnd) {
        this.currentState = router.url;
        this.states.push(router.url);
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

    this.translationService.getSystemLanguages().then(result => this.systemLanguages = result);
    this.selectedLanguage = this.translationService.getSelectedLanguage();
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
    if ((targetClasses.contains('overbody-container') || targetClasses.contains('menu-side-bar')) && (this.isNavigationMenuVisible || this.isLanguageMenuVisible)) {
      this.isNavigationMenuVisible = false;
      this.isLanguageMenuVisible = false;
    }
  }

  onNavigationMenuButtonClick() {
    this.isNavigationMenuVisible = true;
  }

  onLanguageMenuButtonClick() {
    this.isLanguageMenuVisible = true;
  }

  onSelectLanguage(language: Language) {
    this.isLanguageMenuVisible = false;
    this.selectedLanguage = language;
    this.translationService.setLanguage(language);
  }

  onBackButtonClick() {
    this.states.pop();
    this.router.navigate([this.states.pop()]);
  }
}


