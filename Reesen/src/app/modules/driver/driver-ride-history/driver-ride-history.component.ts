import {Component, OnDestroy} from '@angular/core';
import {DriverService} from "../services/driver.service";
import {
  Ride,
  RidePaginated,
  sortRideByDateAscending, sortRideByDateDescending,
  sortRideByPriceAscending,
  sortRideByPriceDescending
} from "../../../models/Ride";
import {TokenDecoderService} from "../../auth/token/token-decoder.service";
import {TaskService} from "../services/task.service";
import {ReviewService} from "../services/review.service";

@Component({
  selector: 'app-driver-ride-history',
  templateUrl: './driver-ride-history.component.html',
  styleUrls: ['./driver-ride-history.component.css']
})
export class DriverRideHistoryComponent implements OnDestroy{


  minDate = "2022-05-02"; // default
  maxDate = "2022-12-31"; // default

  page:number = 1;
  totalEntries: number = 0;
  selectedShowNumber: number = 4;
  selectedPage: number = 1;
  kindsOfSort : string = "timeOfStart,desc";
  sorting : number = 4; // default

  constructor(private driverService : DriverService, private tokenDecoder: TokenDecoderService,
              private reviewService : ReviewService,
              public taskService : TaskService) {

  }
  showSideBar = false;
  driversRides : RidePaginated;
  smartTable : TableRideContent[] = new Array<TableRideContent>;
  hasLoaded: boolean = true;


  ngOnInit() : void {

    this.fetchRides(this.selectedPage);
    const tokenInfo = this.tokenDecoder.getDecodedAccesToken();
    this.driverService.getRidesOfSpecificDriver(tokenInfo.id).subscribe(
      (res : RidePaginated) => {this.totalEntries = res.totalCount})


  }

  fetchRides(selPage : number) : void {
    const tokenInfo = this.tokenDecoder.getDecodedAccesToken();
    this.driverService.getRidesOfSpecificDriver(tokenInfo.id, this.kindsOfSort, this.minDate, this.maxDate,
      selPage-1, this.selectedShowNumber).subscribe(res => {
        this.driversRides = res;
        this.setRatingsOfRide();
        this.setSortedSmartTable();
    })

  }


  searchByDates() {
      this.fetchRides(this.page);
  }

  setSortedSmartTable() {
    if (this.sorting === 1)
      this.driversRides.results.sort(sortRideByPriceAscending);
    else if (this.sorting === 2)
      this.driversRides.results.sort(sortRideByPriceDescending);
    else if (this.sorting === 3)
      this.driversRides.results.sort(sortRideByDateAscending);
    else
      this.driversRides.results.sort(sortRideByDateDescending);

    this.taskService.deleteArray();
    this.generateSmartTable();
  }


  generateSmartTable() {
    for (let i = 0; i < this.driversRides.results.length; i += 2) {
      this.taskService.fillTable({
        column1 : this.driversRides.results[i],
        column2 : this.driversRides.results[i+1],
      });
    }
  }

  setRatingsOfRide() {
    for (let ride of this.driversRides.results) {
      this.reviewService.getReviewsForTheSpecificRide(ride.id).subscribe(
        res => {
           ride.reviews = res;
        }
      );
    }

  }

  ngOnDestroy() {
    this.taskService.deleteArray();
  }


  onTableDataChange(event: any) {
    this.page = event;
    this.fetchRides(this.page);
  }

  setMinValue() {
    const input = document.getElementById('start_date') as HTMLInputElement | null;
    this.minDate = input.value;
  }

  setMaxValue() {
    const input = document.getElementById('end_date') as HTMLInputElement | null;
    this.maxDate = input.value;
  }


  changeKindsOfSort(number: number) {
    this.sorting = number;
    this.setSortedSmartTable();
  }

  changeTotalUsersPerPage() {
    this.fetchRides(this.page);
  }


  checkReviewsAreLoaded(rides: TableRideContent) : boolean {
    if (rides.column1 != undefined && rides.column1.reviews == undefined)
      return false;
    return !(rides.column2 != undefined && rides.column2.reviews == undefined);

  }
}

export interface TableRideContent {
  column1 : Ride,
  column2 : Ride
}
