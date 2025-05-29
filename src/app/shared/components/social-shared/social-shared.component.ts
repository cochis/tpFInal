import { Component, ElementRef, HostListener } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-social-shared',
  templateUrl: './social-shared.component.html',
  styleUrls: ['./social-shared.component.scss']
})
export class SocialSharedComponent {
  isOpen = false;
  shareUrl = 'https://www.myticketparty.com/core';
  shareText = 'MyTicketParty.com';

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    private eRef: ElementRef,
    private location: Location
  ) { }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.isOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  shareOnFacebook() {
    this.getData();
    setTimeout(() => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }, 500);
  }

  shareOnTwitter() {
    this.getData();
    setTimeout(() => {
      const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.shareUrl)}&text=${encodeURIComponent(this.shareText)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }, 500);
  }

  shareOnWhatsApp() {
    this.getData();
    setTimeout(() => {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.shareText)}%20${encodeURIComponent(this.shareUrl)}`;
      window.open(url, '_blank');
    }, 500);
  }

  shareOnLinkedIn() {
    setTimeout(() => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    }, 500);
  }

  getData() {
    const title = this.titleService.getTitle(); // Título del documento
    const descriptionMeta = this.meta.getTag('name="description"');
    const description = descriptionMeta?.content || '';

    const urlActual = window.location.origin + this.location.path();

    this.shareUrl = urlActual;
    this.shareUrl = this.shareUrl.replace('http://localhost:4200/', 'https://www.myticketparty.com/')
    this.shareText = `${title} - ${description} | MyTicketParty.com`;

 
  }
}
