import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ToastController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-habits',
  templateUrl: './habits.page.html',
  styleUrls: ['./habits.page.scss'],
})
export class HabitsPage implements OnInit {
  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}

  navigateToWP1() {
    this.router.navigate(['habits/wp1'])
  }
  navigateToWP2() {
    this.router.navigate(['habits/wp2'])
  }
  navigateToWP3() {
    this.router.navigate(['habits/wp3'])
  }
}
