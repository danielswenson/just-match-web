import {Component, OnInit} from '@angular/core';
import {AuthManager} from './services/auth-manager.service';
import {ActsAsUser} from './services/acts-as-user.service';
import {Router, NavigationStart} from '@angular/router';
import {User} from './models/user';
import {TranslationService} from './services/translation.service';
import {Language} from './models/language/language';
import {UserManager} from './services/user-manager.service';
import {SystemLanguagesService} from './services/system-languages.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SystemLanguagesService]
})
export class AppComponent implements OnInit {
  user: User;
  isCompanyUser: boolean;
  systemLanguages: Language[];
  selectedLanguage: Language;
  isNavigationMenuVisible: boolean = false;
  isLanguageMenuVisible: boolean = false;

  constructor(private router: Router,
              private authManager: AuthManager,
              private userManager: UserManager,
              private actsAsUser: ActsAsUser,
              private systemLanguagesService: SystemLanguagesService,
              public translationService: TranslationService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigationMenuVisible = false;
      }
    });

    this.systemLanguagesService.getSystemLanguages().then(result => this.systemLanguages = result);
    this.selectedLanguage = this.translationService.getSelectedLanguage();
  }

  ngOnInit() {
    this.authManager.authenticateIfNeeded().then(result => {
      this.router.initialNavigation();
      this.user = result;
    });

    this.authManager.getUserChangeEmmiter().subscribe(user => {
      this.isCompanyUser = this.userManager.isCompanyUser();
      this.user = user;
    });

    this.userManager.getUserChangeEmmiter().subscribe(user => {
      this.user = user;
    });

    console.log('Application component initialized ...');
  }

  onBodyClick(event) {
    let targetClasses = event.target.classList;
    if ((targetClasses.contains('overbody-container') || targetClasses.contains('menu-side-bar')) && (this.isNavigationMenuVisible || this.isLanguageMenuVisible)) {
      this.isNavigationMenuVisible = false;
      this.isLanguageMenuVisible = false;
    }
  }

  onNavigationMenuButtonClick() {
    this.isLanguageMenuVisible = false;
    this.isNavigationMenuVisible = !this.isNavigationMenuVisible;
  }

  onLanguageMenuButtonClick() {
    this.isNavigationMenuVisible = false;
    this.isLanguageMenuVisible = !this.isLanguageMenuVisible;
  }

  onSelectLanguage(language: Language) {
    this.isLanguageMenuVisible = false;
    this.selectedLanguage = language;
    this.translationService.setLanguage(language);
  }

  onLogoutButtonClick() {
    this.authManager.logoutUser();
    this.router.navigate(['/home']);
  }

  isActiveSystemLanguage(language: Language): boolean {
   return this.translationService.getSelectedLanguage().languageCode === language.languageCode;
  }

  get isSideMenuVisible(): boolean {
    return this.isNavigationMenuVisible || this.isLanguageMenuVisible;
  }

  get languageBtnIconClassName(): string {
    return this.isLanguageMenuVisible ? 'fa-caret-up' : 'fa-caret-down';
  }
}
