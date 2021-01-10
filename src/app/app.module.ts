import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule} from './app-routing.module';
import { NgxDropzoneModule} from 'ngx-dropzone';
import { FileUploadModule } from 'ng2-file-upload';
import { CloudinaryModule, CloudinaryConfiguration, provideCloudinary} from '@cloudinary/angular-5.x';

import { AppComponent} from './app.component';
import { ProductComponent } from './product/product.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminComponent } from './admin/admin.component';
import { from } from 'rxjs';
import * as cloudinary from 'cloudinary-core';
import cloudinaryConfiguration from './config';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
    declarations: [
        AppComponent,
        ProductComponent,
        NavbarComponent,
        AdminComponent,
        FooterComponent,
        HomeComponent,
        NotFoundComponent,
        ContactUsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MDBBootstrapModule.forRoot(),
        NgxDropzoneModule,
        CloudinaryModule.forRoot(cloudinary, cloudinaryConfiguration),
        FileUploadModule
    ],
    providers: [],
    bootstrap: [AppComponent]

})

export class AppModule { }