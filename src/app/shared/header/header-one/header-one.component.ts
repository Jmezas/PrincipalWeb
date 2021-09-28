import { Component, OnInit, Input, HostListener, Output } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import {errorHandler } from '../../../../assets/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {
  usersForm: FormGroup;
  loginForm:FormGroup;
  @Input() class: string;
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false
  
  public stick: boolean = false;
  closeResult: string;
  info;
  constructor( private modalService: NgbModal,private userAPI:UsersService, private fb: FormBuilder,public auth:AuthService) {
    this.usersForm = this.fb.group({ 
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$'),Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],     
      apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$'),Validators.maxLength(50)]],
      password: ['', ],
      
    })
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    })
   }

  ngOnInit(): void {
  }

  // @HostListener decorador
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  	if (number >= 150 && window.innerWidth > 400) { 
  	  this.stick = true;
  	} else {
  	  this.stick = false;
  	}
  }
  openCreate(content) {
  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  login() {  
    this.auth.login(this.loginForm.value).subscribe(data => {
    
      swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'BIENVENIDO',
        showConfirmButton: false,
        timer: 1500
      })
      this.modalService.dismissAll()
      this.loginForm.reset();
    }, (resp) => {
      const content = errorHandler(resp);
      console.log(content)
      swal.fire({
        position: 'top-end',
        icon: 'error',
        title: content.message,
        showConfirmButton: false,
        timer: 1500
      })
      this.info = { show: true, message: content.message, class: 'alert alert-danger', persist: content.persist || false };
     
    }); 
     
  }
  cerrarSesion(){
    this.auth.logOut();
  }


  private getDismissReason(reason: any): string {
 
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  createUser() {
    console.log(this.usersForm.value)
    this.userAPI.createUser(this.usersForm.value).subscribe(res => { 
      swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'se ha registrado correctamente!',
        showConfirmButton: false,
        timer: 1500
      })

      this.modalService.dismissAll()
      this.usersForm.reset();
    }, (resp) => {
      const content = errorHandler(resp);
      this.info = { show: true, message: content.message, class: 'alert alert-danger', persist: content.persist || false };
     
    })
  }

}
