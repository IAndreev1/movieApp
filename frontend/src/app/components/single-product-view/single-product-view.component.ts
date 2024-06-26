import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ProductDto } from "../../dtos/productDto";
import { ProductService } from "../../services/product.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe, NgClass, NgIf } from "@angular/common";
import { BetDto } from "../../dtos/betDto";
import { BetService } from "../../services/bet.service";
import { FormsModule } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-single-product-view',
  standalone: true,
  imports: [
    NavbarComponent,
    NgIf,
    FormsModule,
    DatePipe,
    NgClass
  ],
  templateUrl: './single-product-view.component.html',
  styleUrls: ['./single-product-view.component.scss']
})
export class SingleProductViewComponent implements OnInit {

  product: ProductDto;
  decodedImage: string;
  bet: BetDto = {
    id: null,
    description: '',
    amount: 0,
    user: null,
    product: null
  };
  userHasBet: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  myProd: boolean;
  userHasBetForProduct: boolean;
  editingBet: boolean;

  constructor(
    private service: ProductService,
    private betService: BetService,
    private notification: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log("onInit");
    this.route.params.subscribe({
      next: params => {
        console.log("param");
        const prodId = params.id;
        this.service.getById(prodId).subscribe({
          next: res => {
            this.authService.getActiveUser().subscribe({
              next: active => {
                this.product = res;
                if (this.product.user.id == active.id) {
                  this.myProd = true;
                }
                this.betService.getAllBetsOfUser().subscribe({
                  next: userBets => {
                    if (userBets) {
                      const userBet = userBets.find(bet => bet.product.id === this.product.id);
                      if (userBet) {
                        this.userHasBetForProduct = true;
                        this.bet = userBet;
                      }
                    }
                  }
                });
                console.log("prod");
                this.decodeImage();
              }
            });
          },
          error: error => {
            // this.router.navigate(['/products'])
          }
        });
      },
      error: () => {
        //  this.router.navigate(['/products']);
      }
    });
  }

  decodeImage(): void {
    if (this.product.imageData != null) {
      if (!this.product.imageData.startsWith('data:image')) {
        this.decodedImage = 'data:image/jpeg;base64,' + this.product.imageData;
      }
    }
  }

  onSubmit() {
    if (this.bet.amount < this.product.price) {
      this.snackBar.open('Bet amount cannot be smaller than the start price', 'Close', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.bet.product = this.product;
    this.betService.createBet(this.bet).subscribe({
      next: () => {
        const message = this.editingBet ? 'Bet successfully updated' : 'Bet successfully placed';
        this.snackBar.open(message, 'Close', {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.ngOnInit();
      },
      error: (error) => {
        // Handle error
      }
    });
  }

  editBet() {
    this.userHasBetForProduct = false;
    this.editingBet = true;
  }
  goBack(){
    this.router.navigate(['/register'])
  }
}
