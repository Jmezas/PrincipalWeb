import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { AuthService } from '../../shared/services/auth.service';
import swal from 'sweetalert2';
import {errorHandler } from '../../../assets/utils';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm:  FormGroup;
  public products: Product[] = [];
  public payPalConfig ? : IPayPalConfig;
  public payment: string = 'Stripe';
  public amount:  any;

  constructor(private fb: FormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
    public auth:AuthService,
    private router: Router) { 
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      //state: ['', Validators.required],
     // postalcode: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
    this.initConfig();
    
    //info de usuario logeado
    this.getInfo()
  }
  getInfo(){
   if(this.auth.getUserInfo()){
    this.checkoutForm.controls['firstname'].setValue(this.auth.getUserInfo()?.user?.nombre )
    this.checkoutForm.controls['lastname'].setValue(this.auth.getUserInfo()?.user?.apellido )
    this.checkoutForm.controls['email'].setValue(this.auth.getUserInfo()?.user?.email )
   }
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  procesoPago(){
    const enviar={
      title:"WEB",
      cliente: this.checkoutForm.value,
      product: this.products,
      total: 0
    }  
    this.orderService.envioOrder(enviar).subscribe(res=>{

      swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '¡compra realizada!',
        showConfirmButton: false,
        timer: 1500
      })

  //elimiar producto 
  localStorage.removeItem("cartItems");
  localStorage.removeItem("wishlistItems");
  this.router.navigate(['home/vegetable']);
    },(res)=>{
      const content = errorHandler(res);
    
      swal.fire({
        position: 'top-end',
        icon: 'error',
        title: content.message,
        showConfirmButton: false,
        timer: 1500
      })

    
     
    
    })
  }

  // Stripe Payment Gateway
  stripeCheckout() { 
    var handler = (<any>window).StripeCheckout.configure({
      key: environment.stripe_token, // publishble key
      locale: 'auto',
      token: (token: any) => {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        this.orderService.createOrder(this.products, this.checkoutForm.value, token.id, this.amount);
      }
    });
    handler.open({
      name: 'Multikart',
      description: 'Online Fashion Store',
      amount: this.amount * 100
    }) 
  }

  // Paypal Payment Gateway
  private initConfig(): void {
    this.payPalConfig = {
        currency: this.productService.Currency.currency,
        clientId: environment.paypal_token,
        createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                currency_code: this.productService.Currency.currency,
                value: this.amount,
                breakdown: {
                    item_total: {
                        currency_code: this.productService.Currency.currency,
                        value: this.amount
                    }
                }
              }
          }]
      },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            size:  'small', // small | medium | large | responsive
            shape: 'rect', // pill | rect
        },
        onApprove: (data, actions) => {
            this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
  }

}
