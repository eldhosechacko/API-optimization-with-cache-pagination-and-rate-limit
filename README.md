/* ======================================================================
README.md - How to Run This Angular Project
======================================================================

This Angular project is the frontend client for the NestJS Optimization API.
It demonstrates:
1.  **Infinite Scrolling:** Consuming the paginated API as the user scrolls.
2.  **API Service:** A dedicated service for interacting with the backend.
3.  **Error Handling:** An HttpInterceptor to catch and alert the user about
    rate-limiting errors (HTTP 429).

---
### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)
- The NestJS API from the `nestjs_api_optimization_demo` artifact must be running.

---
### Step 1: Project Setup

1.  Create a new directory for your Angular project (e.g., `angular-frontend`) and navigate into it.
2.  Save all the files from this document into the `src` subfolder of your project directory, maintaining the folder structure (`/src/app`, `/src/environments`, `/src/assets`).
3.  In your project's root directory, create the `package.json`, `angular.json`, and `tsconfig.json` files with the content provided in this document.
4.  Install the dependencies:
    ```bash
    npm install
    ```
---
### Step 2: Run the Application

1.  Make sure your NestJS API server is running (`npm run start:dev` in its directory).
2.  Start the Angular development server:
    ```bash
    ng serve
    ```
3.  Open your browser and navigate to `http://localhost:4200`.

---
### Step 3: Test the Features

#### A. Test Infinite Scrolling
- As you open the application, it will load the first batch of products.
- Scroll down the list. As you approach the bottom, a "Loading..." message will appear, and the next page of products will be fetched and appended to the list.
- Continue scrolling until you see the "You've reached the end of the list" message.

#### B. Test Rate Limiting
- The NestJS API is configured to allow 5 requests per 10 seconds.
- Scroll very quickly up and down in the product list to trigger multiple API calls in rapid succession.
- Once you exceed the limit, an alert box will pop up in the browser with the message: "Too many requests. Please slow down and try again later." This is handled by our `ErrorInterceptor`.

======================================================================
*/

/*
----------------------------------------------------------------------
File: /package.json
----------------------------------------------------------------------
*/
{
  "name": "angular-frontend",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^17.3.0",
    "@angular/common": "^17.3.0",
    "@angular/compiler": "^17.3.0",
    "@angular/core": "^17.3.0",
    "@angular/forms": "^17.3.0",
    "@angular/platform-browser": "^17.3.0",
    "@angular/platform-browser-dynamic": "^17.3.0",
    "@angular/router": "^17.3.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.3"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^17.3.7",
    "@angular/cli": "^17.3.7",
    "@angular/compiler-cli": "^17.3.0",
    "@types/node": "^18.18.0",
    "typescript": "~5.4.2"
  }
}


/*
----------------------------------------------------------------------
File: /angular.json
----------------------------------------------------------------------
*/
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "angular-frontend": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/angular-frontend",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "angular-frontend:build:production"
            },
            "development": {
              "buildTarget": "angular-frontend:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}


/*
----------------------------------------------------------------------
File: /tsconfig.json
----------------------------------------------------------------------
*/
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

/*
----------------------------------------------------------------------
File: /src/index.html
----------------------------------------------------------------------
*/
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AngularFrontend</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>

/*
----------------------------------------------------------------------
File: /src/main.ts
----------------------------------------------------------------------
*/
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './app/error.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // Provide HttpClient and register our interceptor
    provideHttpClient(
      withInterceptors([errorInterceptor])
    )
  ]
}).catch(err => console.error(err));


/*
----------------------------------------------------------------------
File: /src/app/app.component.ts
----------------------------------------------------------------------
*/
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, PaginatedProducts } from './product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private productService = inject(ProductService);

  products: any[] = [];
  currentPage = 1;
  totalPages = 0;
  limit = 15; // Load more items per page for a better scroll feel
  isLoading = false;
  allProductsLoaded = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    if (this.isLoading || this.allProductsLoaded) {
      return; // Exit if already loading or all data is loaded
    }

    this.isLoading = true;
    this.productService
      .getProducts(this.currentPage, this.limit)
      .subscribe((response: PaginatedProducts) => {
        // Append the new data to the existing list
        this.products = [...this.products, ...response.data];
        this.totalPages = response.totalPages;
        
        if (this.currentPage >= this.totalPages) {
          this.allProductsLoaded = true;
        }

        this.isLoading = false;
      });
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const threshold = 150; // The distance from the bottom to trigger the load

    // Check if the user has scrolled to the bottom of the container
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

    if (isAtBottom && !this.isLoading && !this.allProductsLoaded) {
      this.currentPage++; // Increment page number
      this.loadProducts();   // Load the next page of products
    }
  }
}

/*
----------------------------------------------------------------------
File: /src/app/app.component.html
----------------------------------------------------------------------
*/
<main class="main-content">
  <div class="product-container" (scroll)="onScroll($event)">
    <header>
      <h1>Product Catalog</h1>
      <p>Scroll down to see more items</p>
    </header>
    <ul class="product-list">
      <li *ngFor="let product of products" class="product-item">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-category">{{ product.category }}</span>
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
      </li>
    </ul>

    <div *ngIf="isLoading" class="feedback-indicator">
      <p>Loading more products...</p>
    </div>

    <div *ngIf="allProductsLoaded && !isLoading" class="feedback-indicator">
      <p>You've reached the end of the list.</p>
    </div>
  </div>
</main>


/*
----------------------------------------------------------------------
File: /src/app/app.component.css
----------------------------------------------------------------------
*/
body, html {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background-color: #f4f7f6;
  color: #333;
}

.main-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.product-container {
  height: 85vh;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

header {
  text-align: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
}

header h1 {
  margin: 0;
  color: #1a1a1a;
}

header p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.product-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease-in-out;
}

.product-item:hover {
  background-color: #f9f9f9;
}

.product-item:last-child {
  border-bottom: none;
}

.product-name {
  font-weight: 500;
}

.product-category {
  color: #555;
  background-color: #efefef;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.product-price {
  font-weight: 600;
  color: #007bff;
}

.feedback-indicator {
  text-align: center;
  padding: 2rem;
  color: #888;
  font-style: italic;
}

/* Custom scrollbar for better aesthetics */
.product-container::-webkit-scrollbar {
  width: 8px;
}
.product-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.product-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.product-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}


/*
----------------------------------------------------------------------
File: /src/app/product.service.ts
----------------------------------------------------------------------
*/
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PaginatedProducts {
  data: any[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products/paginated`;

  getProducts(page: number, limit: number): Observable<PaginatedProducts> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedProducts>(this.apiUrl, { params });
  }
}

/*
----------------------------------------------------------------------
File: /src/app/error.interceptor.ts
----------------------------------------------------------------------
*/
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429) {
        // Handle rate limiting error
        alert('Too many requests. Please slow down and try again later.');
      }
      // Re-throw the error to be handled by other parts of the application
      return throwError(() => error);
    })
  );
};


/*
----------------------------------------------------------------------
File: /src/environments/environment.ts
----------------------------------------------------------------------
*/
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
