import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  constructor() { }

  confirmation(){
    alert("Thank you for your message! We'll get back to you as soon as we can.")
  }

  ngOnInit(): void {
  }

}
