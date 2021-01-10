import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { from } from "rxjs";
import { Cart, Product } from "../product";
import { ProductService } from "../product.service";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
  products: Product[];

  editField: string;
  orderValue = "";
  log = "";
  cartList: Array<Cart> = [];

  remove(id: any) {

    this.cartList.splice(id, 1);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  orderConfirmation(){
    alert("Order Submitted! We'll get in touch with you within 10mins, Thank you for using our service!")
  }

  add(product: Cart) {
    var i = 0;
    var found = false;
    while (i < this.cartList.length) {
      if (product.name === this.cartList[i].name) {
        this.cartList[i].amount++;
        found = true;
        break;
      }
      i++;
    }
    if (!found) {
      product.amount = 1;
      this.cartList.push(product);
    }
  }

  logOrder(): void {
    this.log += JSON.stringify(this.cartList, null,5);
  }

  showCartDetails() {
    var show = document.getElementById("cartDetails");
      show.style.display = "block";
  }
  
  showCart() {
    var show = document.getElementById("cart");
      show.style.display = "block";
  }


  hideCart() {
    var show = document.getElementById("cart");
      show.style.display = "none";
  }


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    return this.productService.getProducts().subscribe((products) => {
      console.log(products);
      this.products = products;
    });
  }

  getProductByCategory(category: string) {
    return this.productService
      .getProductByCategory(category)
      .subscribe((products) => {
        console.log(products);
        this.products = products;
      });
  }
}
