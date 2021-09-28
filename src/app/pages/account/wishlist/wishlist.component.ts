import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    //this.router.navigate(['https://api.whatsapp.com/send?phone=51941446376&text=Hola!%20Quiero%20generar%20mas%20ventas!']);
  }

}
