import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { HabitsPageRoutingModule } from './habits-routing.module'

import { HabitsPage } from './habits.page'
import { SharedUiModule } from '../shared-ui/shared-ui.module'
import { WP1Component } from './wp1/wp1.component'
import { WP2Component } from './wp2/wp2.component'
import { WP3Component } from './wp3/wp3.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HabitsPageRoutingModule,
    SharedUiModule,
  ],
  declarations: [HabitsPage, WP1Component, WP2Component, WP3Component],
})
export class HabitsPageModule {}
