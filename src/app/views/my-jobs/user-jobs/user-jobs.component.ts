import {Component, Input, OnInit} from '@angular/core';
import {Job} from '../../../models/job/job';
import {UserManager} from '../../../services/user-manager.service';
import {UserJob} from '../../../models/user/user-job';
import {map} from 'lodash';
import {UserProxy} from '../../../services/proxy/user-proxy.service';

@Component({
  selector: 'user-jobs',
  templateUrl: './user-jobs.component.html',
  providers: [UserProxy]
})
export class UserJobsComponent implements OnInit {
  @Input() selectedState: string;
  userJobs: UserJob[];
  currentJobs: Job[] = []; // not invoiced
  historyJobs: Job[] = []; // invoiced

  constructor(private userProxy: UserProxy, private userManager: UserManager) {
  }

  ngOnInit() {
    this.userProxy.getUserJobs(this.userManager.getUserId(), {include: 'job, job.company'}).then((jobs) => {
      this.userJobs = jobs;
      this.generateJobSections();
    });

  }

  generateJobSections() {
    this.currentJobs = map(this.userJobs.filter((userJob) => !userJob.invoice.id), userJob => {
      let job = userJob.job;
      job.jobUsers = [userJob];
      return job;
    });

    this.historyJobs = map(this.userJobs.filter((userJob) => !!userJob.invoice.id), userJob => userJob.job);
  }
}
