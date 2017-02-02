import {Component, OnInit} from '@angular/core';
import {UserProxy} from '../../../services/proxy/user-proxy.service';
import {User} from '../../../models/user';
import {UserManager} from '../../../services/user-manager.service';
import {AuthManager} from '../../../services/auth-manager.service';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  private selectedState: string = 'profile';

  private user: User;
  private imageSaveSuccess: boolean;
  private imageSaveFail: boolean;

  constructor(
    private userProxy: UserProxy,
    private userManager: UserManager,
    private authManager: AuthManager
  ) {
    this.user = this.userManager.getUser();
  }

  ngOnInit() {
    this.authManager.getUserChangeEmmiter().subscribe(user => {
      this.user = user;
    });
  }

  private setState(newState) {
    this.authManager.authenticateIfNeeded();
    this.selectedState = newState;
  }

  private onProfileImageFilenameChange(event) {
    let file = event.srcElement.files[0];
    if (file) {
      this.userProxy.saveImage(this.user.id, file, 'profile').then(userImage => {
        this.user.profile_image = userImage;
        this.imageSaveFail = false;
        this.imageSaveSuccess = true;
      }).catch(errors => {
        this.imageSaveSuccess = false;
        this.imageSaveFail = true;
      });
    }
  }
}
