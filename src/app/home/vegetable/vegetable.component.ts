import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../shared/data/slider';
import { Product } from '../../shared/classes/product';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-vegetable',
  templateUrl: './vegetable.component.html',
  styleUrls: ['./vegetable.component.scss']
})
export class VegetableComponent implements OnInit {

  public products: Product[] = [];
  public ProductSliderConfig: any = ProductSlider;

  constructor(public productService: ProductService) {
    this.productService.getProducts.subscribe(response => 
      this.products = response.filter(item => item.type == 'vegetables')
    );
  }

  // Sliders
  public sliders = [{
    title: 'guarde 15%',
    subTitle: '',
    image: 'assets/images/slider/banner.png'
  }, {
    title: 'guarde 10%',
    subTitle: 'vegetales frescos',
    image: 'assets/images/slider/banner_verduras.png'
  }];

  // Blogs
  public blogs = [{
    image: 'assets/images/blog/6.jpg',
    date: '25 January 2018xx',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/7.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/8.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/9.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit jhaser,',
    by: 'John Dio'
  }]

  ngOnInit(): void {
  }

}
