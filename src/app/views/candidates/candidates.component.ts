import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JobProxy} from '../../services/proxy/job-proxy.service';
import {UserJob} from '../../models/user/user-job';
import {Job} from '../../models/job/job';

@Component({
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'],
  providers: [JobProxy]
})
export class CandidatesComponent implements OnInit {
  jobId: number;
  job: Job;
  userJobs: UserJob[];

  constructor(private route: ActivatedRoute, private jobProxy: JobProxy, private router: Router) {
    this.route.params.subscribe(params => {
      this.jobId = parseInt(params['id']);
    });
  }

  ngOnInit() {
    this.jobProxy.getJob(this.jobId, {include: 'job_users,company,hourly_pay,company.company_images'}).then(response => {
      this.job = response;
    });
    this.jobProxy.getJobUsers(this.jobId, {include: 'user,user.user_images'}).then(response => {
      console.log(response);
      this.userJobs = response;
    });
  }

  onCandidateClick(userJobId) {
    this.router.navigate(['/job/' + this.jobId + '/candidate/' + userJobId]);
  }

}