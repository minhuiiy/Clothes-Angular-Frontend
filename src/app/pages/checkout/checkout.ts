import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth';
import { AddressService, AddressResponse } from '../../core/services/address.service';
import { LocationService } from '../../core/services/location.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private locationService = inject(LocationService);

  cart = toSignal(this.cartService.cart$);
  loading = signal(false);
  user = toSignal(this.authService.currentUser$);
  
  savedAddresses = signal<AddressResponse[]>([]);
  useSavedAddress = signal(true);
  selectedAddressId = signal<number | null>(null);

  provinces = signal<any[]>([]);
  districts = signal<any[]>([]);
  wards = signal<any[]>([]);

  checkoutForm = this.fb.group({
    fullName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    province: [''],
    district: [''],
    ward: [''],
    addressDetail: ['', [Validators.required]],
    note: [''],
    paymentMethod: ['COD', [Validators.required]]
  });

  ngOnInit(): void {
    if (!this.cart() || this.cart()?.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    // Pre-fill from current user immediately
    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        fullName: user.fullName || user.username,
        phoneNumber: user.phoneNumber || ''
      });
    }

    this.loadInitialData();
  }

  loadInitialData() {
    // Load saved addresses
    this.addressService.getAddresses().subscribe(addresses => {
      this.savedAddresses.set(addresses);
      if (addresses.length > 0) {
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        this.selectAddress(defaultAddr);
      } else {
        this.useSavedAddress.set(false);
        // Pre-fill from user account if no saved addresses
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.checkoutForm.patchValue({
            fullName: currentUser.fullName,
            phoneNumber: currentUser.phoneNumber
          });
        }
      }
    });

    // Load provinces
    this.locationService.getProvinces().subscribe({
      next: (data) => {
        console.log('Provinces loaded:', data);
        this.provinces.set(data);
      },
      error: (err) => console.error('Error loading provinces', err)
    });
  }

  selectAddress(addr: AddressResponse) {
    this.selectedAddressId.set(addr.id);
    this.checkoutForm.patchValue({
      fullName: addr.recipientName,
      phoneNumber: addr.phoneNumber
    });
  }

  onProvinceChange(event: any) {
    const provinceCode = event.target.value;
    this.districts.set([]);
    this.wards.set([]);
    this.checkoutForm.patchValue({ district: '', ward: '' });
    
    if (provinceCode) {
      this.locationService.getDistricts(provinceCode).subscribe(data => {
        this.districts.set(data.districts);
      });
    }
  }

  onDistrictChange(event: any) {
    const districtCode = event.target.value;
    this.wards.set([]);
    this.checkoutForm.patchValue({ ward: '' });

    if (districtCode) {
      this.locationService.getWards(districtCode).subscribe(data => {
        this.wards.set(data.wards);
      });
    }
  }

  getProvinceName(code: string): string {
    return this.provinces().find(p => p.code == code)?.name || '';
  }

  getDistrictName(code: string): string {
    return this.districts().find(d => d.code == code)?.name || '';
  }

  getWardName(code: string): string {
    return this.wards().find(w => w.code == code)?.name || '';
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid && !this.useSavedAddress()) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    
    let shippingAddress = '';
    let phoneNumber = this.checkoutForm.value.phoneNumber;
    let fullName = this.checkoutForm.value.fullName;

    if (this.useSavedAddress()) {
      const addr = this.savedAddresses().find(a => a.id === this.selectedAddressId());
      if (addr) {
        shippingAddress = `${addr.addressDetail}, ${addr.ward}, ${addr.district}, ${addr.province}`;
        phoneNumber = addr.phoneNumber;
        fullName = addr.recipientName;
      }
    } else {
      const p = this.getProvinceName(this.checkoutForm.value.province!);
      const d = this.getDistrictName(this.checkoutForm.value.district!);
      const w = this.getWardName(this.checkoutForm.value.ward!);
      shippingAddress = `${this.checkoutForm.value.addressDetail}, ${w}, ${d}, ${p}`;
    }

    const orderData = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      shippingAddress: shippingAddress,
      note: this.checkoutForm.value.note,
      paymentMethod: this.checkoutForm.value.paymentMethod,
      totalAmount: this.cart()?.totalPrice
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.cartService.loadCart();
        this.router.navigate(['/orders', res.id]);
      },
      error: (err) => {
        console.error('Error creating order', err);
        this.loading.set(false);
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
      }
    });
  }
}
