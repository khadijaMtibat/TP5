import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Router} from "@angular/router";
import Swal from "sweetalert2";


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  public products :Array<Product>=[];
  public keyword : string="";
  public pagesize:number=4;
  public currentPage:number=1;
  public totalPages:number=0;
  test=true;
  constructor(private productService:ProductService,private router:Router) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){

    this.productService.getProducts(this.keyword,this.currentPage,this.pagesize)
      .subscribe({
        next : (resp)=> {
          this.products = resp.body as Product[];
          let totalCount: number = parseInt(resp.headers.get("x-total-count")!);
          this.totalPages = Math.floor(totalCount / this.pagesize);
          if (totalCount % this.pagesize !== 0) ++this.totalPages;

        },
          error : err => {
          console.log(err);
        }
        })

  }
handleSearch(){
  this.currentPage = 1
  this.getProducts()
}
  goToPage(page: number) {
    this.currentPage=page
    this.getProducts()
  }
  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next :updatedProduct => {
        product.checked=!product.checked;
        //this.getProducts();
      }
    })
  }

  handleDelete(product: Product) {
    this.productService.deleteProduct(product).subscribe({
      next:value => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            this.products=this.products.filter(p=>p.id!=product.id);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });


      }
    })
  }
  handleEdit(product:any) {
    this.router.navigateByUrl(`/editProduct/${product.id}`);
  }
}
