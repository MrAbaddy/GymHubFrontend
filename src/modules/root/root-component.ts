import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root-component',
  imports: [
    MatCardContent,
    RouterOutlet
  ],
  templateUrl: './root-component.html',
  styleUrl: './root-component.css',
})
export class RootComponent {
}
