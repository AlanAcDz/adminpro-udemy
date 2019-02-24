import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/index.services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  constructor(public sidebarServ: SidebarService) { }

  ngOnInit() {
  }

}
