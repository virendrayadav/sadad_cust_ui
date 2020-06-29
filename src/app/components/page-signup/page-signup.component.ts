import {Component, OnInit} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../../../app/services/user.service";
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

declare let $: any;

@Component({selector: "app-page-signup", templateUrl: "./page-signup.component.html", styleUrls: ["./page-signup.component.scss"]})
export class PageSignupComponent implements OnInit {
  constructor(private router: Router,private user:UserService) {}


	// Private properties
	private subscriptions: Subscription[] = [];

  userForm: FormGroup;
  errorMsg: any;


  initialization() {
    //======================
    // Preloder
    //======================
    $(window).on("load", function () {
      $("#status").fadeOut();
      $("#preloader").delay(500).fadeOut("slow");
      $("body").delay(500).css({overflow: "visible"});
    });
    $(".sl-slider-caro").owlCarousel({dots: true, items: 1, nav: false, smartSpeed: 500});
    // ============================
    // Button Animation
    // ============================
    $(".btn").on("mouseenter mousemove", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find(".bh").css({top: relY, left: relX});
      var origin = relX + "px" + " " + relY + "px";
    }).on("mouseout", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find(".bh").css({top: relY, left: relX});
    });
  }

  ngOnInit() {
    this.initialization();
  }


  	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
  addUser(withBack: boolean = true) {

    const formData: FormData = new FormData();

    formData.append("fullName", this.userForm.value.fullName);
    formData.append("email", this.userForm.value.email);
    formData.append("userName", this.userForm.value.userName);
    formData.append("phone", this.userForm.value.phone);
    formData.append("password", this.userForm.value.password);
    formData.append("userType", this.userForm.value.userType);

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    this.user.createUser(formData)
      .subscribe(res => {
        console.log(res)
        if (this.userForm.value.userType == 'Admin') {
          const message = `New user successfully has been added.`;
          //this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
          this.router.navigate(['/adminlist']);
          this.userForm.reset();
        } else {
          this.router.navigate(['/collectorlist']);
          this.userForm.reset();
        }


        error => {
          this.errorMsg = error
          console.log(error)
        }

      });
// viren
    // const addSubscription = this.store.pipe(select(selectLastCreatedUserId)).subscribe(newId => {
      // const message = `New user successfully has been added.`;
      // this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, true);
      // this.router.navigate(['/user-management/admins']);
      // this.userForm.reset();
      // if (newId) {
      // 	if (withBack) {
      // 		this.goBackWithId();
      // 	} else {
      // 		this.refreshUser(true, newId);
      // 	}
      // }
    // });
// viren
    // this.subscriptions.push(addSubscription);
  }

}
