import { TestBed } from '@angular/core/testing';
import { Product } from '../../data-access/product.model';
import { ProductStats } from './product-stats';

describe('ProductStats', () => {
  const products: Product[] = [
    { id: '1', name: 'Coca Cola 1.5L', brand: 'Coca Cola', price: 2500, stock: 10 },
    { id: '2', name: 'Pepsi 2L', brand: 'Pepsi', price: 2000, stock: 3 },
    { id: '3', name: 'Sprite 1L', brand: 'Coca Cola', price: 1500, stock: 0 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStats],
    }).compileComponents();
  });

  it('should summarize the products', async () => {
    const fixture = TestBed.createComponent(ProductStats);
    fixture.componentRef.setInput('products', products);
    await fixture.whenStable();

    const values = Array.from(
      fixture.nativeElement.querySelectorAll('dd') as NodeListOf<HTMLElement>,
    ).map((dd) => dd.textContent?.trim());

    expect(values).toEqual(['3', '13', '31,000', '2']);
  });
});
