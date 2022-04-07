import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HabitsPage } from './habits.page'
import { WP1Component } from './wp1/wp1.component'
import { WP2Component } from './wp2/wp2.component'
import { WP3Component } from './wp3/wp3.component'

const routes: Routes = [
  {
    path: '',
    component: HabitsPage,
  },
  {
    path: 'wp1',
    component: WP1Component,
  },
  {
    path: 'wp2',
    component: WP2Component,
  },
  {
    path: 'wp3',
    component: WP3Component,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HabitsPageRoutingModule {}
