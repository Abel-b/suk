import { Location } from "@angular/common";
import { Component, Input, NgZone, OnInit } from "@angular/core";
import { Product } from "../product";
import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from "ng2-file-upload";
import { Cloudinary } from "@cloudinary/angular-5.x";
import { ProductService } from "../product.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  providers: [ProductService],
})
export class AdminComponent implements OnInit {
  @Input()
  responses: Array<any>;

  public hasBaseDropZoneOver: boolean = false;
  public uploader: FileUploader;
  public title: string;
  public imageUrl: string;
  message: string;

  product = new Product();
  submitted = false;

  constructor(
    private productService: ProductService,
    private location: Location,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient
  ) {
    this.responses = [];
    this.title = "";
    this.imageUrl = "";
  }

  ngOnInit(): void {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: "X-Requested-With",
          value: "XMLHttpRequest",
        },
      ],
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append("upload_preset", this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = "shemsu";
      if (this.title) {
        form.append("context", `photo=${this.title}`);
        tags = `shemsu,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append("folder", "angular_sample");
      // Add custom tags
      form.append("tags", tags);
      // Add file to upload
      form.append("file", fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = (fileItem) => {
      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(
            this.responses[existingId],
            fileItem
          );
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (
      item: any,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) =>
      upsertResponse({
        file: item.file,
        status,
        data: JSON.parse(response),
      });

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse({
        file: fileItem.file,
        progress,
        data: {},
      });
  }

  updateTitle(value: string) {
    this.title = value;
  }
  
  showAddProduct() {
    var show = document.getElementById("addProduct");
    if (show.style.display == "block") {
      show.style.display = "none";
    } else {
      show.style.display = "block";
    }
  }

  showUpdateProduct() {
    var show = document.getElementById("updateProduct");
    if (show.style.display == "block") {
      show.style.display = "none";
    } else {
      show.style.display = "block";
    }
  }

  showDeleteProduct(){
    var show = document.getElementById("deleteForm");
    if (show.style.display == "block") {
      show.style.display = "none";
    } else {
      show.style.display = "block";
    }

  }

  // Delete an uploaded image
  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
    }/delete_by_token`;
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    });
    const options = { headers: headers };
    const body = {
      token: data.delete_token,
    };
    this.http.post(url, body, options).subscribe((response) => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    for (const key in fileProperties) {
      if (key == "url") {
        console.log("FASIKA " + this.getFileImage(fileProperties));
        const imageUrl = fileProperties[key];
      }
    }
    return Object.keys(fileProperties).map((key) => ({
      key: key,
      value: fileProperties[key],
    }));
  }

  newProduct(): void {
    this.submitted = false;
    this.product = new Product();
  }

  addProduct() {
    this.submitted = true;
    this.save();
    console.log("Successfully added product!");
    alert("Product Added Successfully!")
  }

  private save(): void {
    console.log(this.product);
    this.productService.addProduct(this.product).subscribe();
  }

  getFileImage(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    for (const key in fileProperties) {
      if (key == "url") {
        this.imageUrl = fileProperties[key];
      }
    }
    console.log("IMAGE URL function " + this.imageUrl);
    return this.imageUrl;
  }

  updateProduct(): void {
    this.submitted = true;
    this.productService.updateProduct(this.product)
        .subscribe(result => this.message = "Customer Updated Successfully!");
        alert("Product Updated Successfully!")
        this.location.back();
  }

  deleteProduct(): void {
    this.submitted = true;
    this.productService.deleteProduct(this.product.name)
        .subscribe(result => this.message = "Customer Deleted Successfully!");
        alert("Product Deleted Successfully!")
  }

}
