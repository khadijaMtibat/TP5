import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ProductService} from "../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{

  public productFormGroup!:FormGroup;
  id!:number;


  constructor(private fb: FormBuilder,private router:Router, private route: ActivatedRoute, private productService:ProductService) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id=params['id'];
       this.getProductById()
    })
  }

  getProductById(){
    this.productService.getProductById(this.id).subscribe({
      next: (data: any) => {
        this.productFormGroup = this.fb.group({
          name: this.fb.control(data.name, [Validators.required, Validators.minLength(4)]),
          price: this.fb.control(data.price),
          checked: this.fb.control(data.checked)
        });
      }
    })
  }
  getErrorMessage(name: string, errors: ValidationErrors):string {
    if(errors['required']){
      return name + " is Required";
    } else if (errors['minlength']){
      return name +" should have at least "+errors['minlength']['requiredLength']+" Characters";
    } else return "";
  }

  handleUpdateProduct() {
    let product=this.productFormGroup.value;

    this.productService.updateProduct(this.id,product)
      .subscribe({
        next :(data)=>{
          Swal.fire({
            title: "Modifier avec succés!",
            text: "",
            icon: "success"
          });
          this.router.navigateByUrl(`/products`);
        },
        error : (err)=>{
          console.log("err")
        }
      })
  }
}
