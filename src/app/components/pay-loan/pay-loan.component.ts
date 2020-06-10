import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from "@angular/common/http";
import { UserService } from "../../../app/services/user.service";

@Component({
  selector: 'app-pay-loan',
  templateUrl: './pay-loan.component.html',
  styleUrls: ['./pay-loan.component.scss']
})
export class PayLoanComponent implements OnInit {

 // Public params
 loanForm: FormGroup;
 loading = false;
 message:any;
 id:any;
 
 constructor( private fb: FormBuilder,
              private router: Router,
              private route:ActivatedRoute,
              private user:UserService) {}

  ngOnInit() {
    this.initLoanForm();
    this.route.params.subscribe(params=>{
      this.id= params['id'];
     
    })
  }

  initLoanForm() {
		this.loanForm = this.fb.group({
			amount_paid: ['', Validators.compose([
				Validators.required,
			])
			],
			description: ['', Validators.compose([
				Validators.required,
		  ])
			]
		});
  }

    /**
	 * Form Submit
	 */
	submit() {
   
		const controls = this.loanForm.controls;
		/** check form */
		if (this.loanForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;
	var customer_id=localStorage.getItem('currentUserId')
    const formData: FormData = new FormData();
        formData.append("loan_id",  this.id);
		formData.append("amount_paid", this.loanForm.value.amount_paid);
		formData.append("customer_id", customer_id);
		formData.append("description", this.loanForm.value.description);
	
		
		const httpHeaders = new HttpHeaders();
		httpHeaders.append('Content-Type','multipart/form-data');
		
		this.user.payLoan(formData).subscribe((res: any)=>{
			console.log(res)
        this.router.navigate(['/userloan']);
			
			}, (err)=>{
				console.log(err)
			
			}
		)
	
	}

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loanForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

}