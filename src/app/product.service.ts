import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "./product";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { Photo } from "./photo";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "ec2-34-200-158-205.compute-1.amazonaws.com";

  constructor(private http: HttpClient, private cloudinary: Cloudinary) {}

  getPhotos(): Observable<Photo[]> {
    let url = this.cloudinary.url("shemsu", {
      format: "json",
      type: "list",
      version: Math.ceil(new Date().getTime() / 1000),
    });

    return this.http.get(url).pipe(map((data: any) => data.resources));
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url);
  }

  getProductByCategory(category: string): Observable<Product[]> {
    const url = `${this.productsUrl}/${category}`;
    return this.http.get<Product[]>(url);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product, httpOptions);
  }

  deleteProduct(product: Product | string): Observable<Product> {
    const name = typeof product === "string" ? product : product.name;
    const url = `${this.productsUrl}/${name}`;
    return this.http.delete<Product>(url, httpOptions);
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put(this.productsUrl, product, httpOptions);
  }
}
