import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../model/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
host:string="http://localhost:8089"
  constructor(private http: HttpClient) { }

  getProducts(keyword:string, page:number, size:number) {
    return this.http.get(`${this.host}/products?name_like=${keyword}&_page=${page}&_limit=${size}`,{observe:'response'});
  }
  checkProduct(product:any){
    return this.http.patch(`${this.host}/products/${product.id}`,{checked:!product.checked});
  }
  deleteProduct(product:any){
    return this.http.delete(`${this.host}/products/${product.id}`);
  }
  saveProduct(product:any){
    return this.http.post(`${this.host}/products`,product);
  }
  getProductById(id:number){
    return this.http.get(`${this.host}/products/${id}`);
  }
  updateProduct(id:number, product:any){
    return this.http.put(`${this.host}/products/${id}`,product);
  }
}
