import {Component, OnInit} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";

declare let $: any;

@Component({selector: "app-page-signup", templateUrl: "./page-signup.component.html", styleUrls: ["./page-signup.component.scss"]})
export class PageSignupComponent implements OnInit {

  signupForm:FormGroup;
  loading:false;
  msg: string = null;
  showMsg: boolean = false;
  constructor(
    private user:UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

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
    this.initSignForm();
  }
  initSignForm() {
		this.signupForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
			])
			],
			password: ['', Validators.compose([
				Validators.required,
			])
      ],
      fullName: ['', Validators.compose([
				Validators.required,	
			])
      ],
      phone: ['', Validators.compose([
				Validators.required,	
			])
      ],
      civilId: ['', Validators.compose([
				Validators.required,	
			])
			],
		});
  }

  submit() {
		const controls = this.signupForm.controls;

		// check form
		if (this.signupForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

	//	this.loading = true;
		const formData: FormData = new FormData();
	
		formData.append("fullName", this.signupForm.value.fullName);
		formData.append("email", this.signupForm.value.email);
		formData.append("civilId",this.signupForm.value.civilId);
		formData.append("phone",this.signupForm.value.phone);
    formData.append("password", this.signupForm.value.password);
    formData.append("userType","User");
		// formData.append("userType", this.signupForm.value.userType);
	
        const httpHeaders = new HttpHeaders();
        httpHeaders.append('Content-Type','multipart/form-data');
        this.user.createUser(formData)
        .subscribe(res=>{
		  this.loading = false;
		  //console.log(res)
		  const message = `New user has been created successfully.`;
		 
		  this.showMsg= true;
		},
		  (err)=>{
			// this.loading = true;
			// const message = `Unable to Create User.`;
			// this.authNoticeService.setNotice(this.translate.instant(message), 'danger');
			// this.loading = false;
			// this.router.navigate(['/auth/register']);
		}
	);
	
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.signupForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
