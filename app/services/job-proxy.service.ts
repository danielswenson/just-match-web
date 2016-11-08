import {Injectable} from "@angular/core";
import {ApiCall} from "./api-call.service";
import {map} from "lodash";
import {Job} from "../models/job/job";

@Injectable()
export class JobProxy {

  constructor(private apiCall: ApiCall) { }

  getJobs(additionOptions?: Object) {
    return this.apiCall.get('jobs',  additionOptions).then(response => {
      return {
        data: map(response.data, data => new Job(data)),
        total: response.total
      };
    });
  }

  getJob(jobId: number, additionOptions?: Object): Promise<Job> {
    return this.apiCall.get('jobs/' + jobId, additionOptions).then(response => {
      return new Job(response.data);
    });
  }

}
