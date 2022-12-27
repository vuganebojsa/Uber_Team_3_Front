import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { EmailInfo } from 'src/app/models/Email';
import { PageRemark, Remark } from 'src/app/models/Remark';
import { RideInfo, RideInfoBody } from 'src/app/models/Ride';
import { PageUsers } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getRideAssumption(rideInfoBody: RideInfoBody):Observable<RideInfo>{
    return this.http.post<RideInfo>(environment.apiHost + "api/unregisteredUser/", rideInfoBody);
  }

  sendEmail(emailInfo: EmailInfo):Observable<EmailInfo>{
    return this.http.post<EmailInfo>(environment.apiHost + "api/user/", emailInfo);
  }
  updatePassword(id:number, newPassword:string, oldPassword:string): Observable<void>{
      return this.http.put<void>(environment.apiHost + "api/user/" + id + "/changePassword",
      {
        new_password: newPassword,
        old_password: oldPassword
      });
  }
  getUsers(page: number, size:number): Observable<PageUsers>{
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.http.get<PageUsers>(environment.apiHost + "api/user", {
      params:params
    });
  }
  getUsersByRole(page:number, size:number, role: string): Observable<PageUsers>{
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    if(role === "DRIVER")
      return this.http.get<PageUsers>(environment.apiHost + "api/driver", {
        params:params
      });
    else
    return this.http.get<PageUsers>(environment.apiHost + "api/passenger", {
      params:params
    });
  }

  getTotalNumberOfUsers(): Observable<number>{
    return this.http.get<number>(environment.apiHost + "api/user/number-of-users");
  }

  blockUser(id: number): Observable<void>{
    return this.http.put<void>(environment.apiHost + "api/user/" + id + "/block", null);
  }

  getUserIsBlocked(id: number): Observable<boolean>{
    return this.http.get<boolean>(environment.apiHost + "api/user/" + id + "/is-blocked");

  }

  createRemark(userId: number, message: string): Observable<Remark>{
    return this.http.post<Remark>(environment.apiHost + "api/user/" + userId + "/note", message);
  }
  getRemarks(userId: number, page: number, size: number): Observable<PageRemark>{
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return this.http.get<PageRemark>(environment.apiHost + "api/user/" + userId + "/note",
    {params:params});
  }
}
