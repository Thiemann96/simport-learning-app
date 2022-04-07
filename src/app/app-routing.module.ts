import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    // FIXME: this should route depending wether we have persisted an previous selected trajectory to that one,
    // or to select-trajectory..
    path: '',
    redirectTo: 'select-trajectory',
    pathMatch: 'full',
  },
  {
    path: 'trajectory/:trajectoryType/:trajectoryId',
    loadChildren: () =>
      import('./trajectory/trajectory.module').then(
        (m) => m.TrajectoryPageModule
      ),
  },
  {
    path: 'select-trajectory',
    loadChildren: () =>
      import('./select-trajectory/select-trajectory.module').then(
        (m) => m.SelectTrajectoryPageModule
      ),
  },
  {
    path: 'tracking',
    loadChildren: () =>
      import('./tracking/tracking.module').then((m) => m.TrackingPageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: 'diary',
    loadChildren: () =>
      import('./diary/diary.module').then((m) => m.DiaryPageModule),
  },
  {
    path: 'habits',
    loadChildren: () =>
      import('./habits/habits.module').then((m) => m.HabitsPageModule),
  },
]
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules,
      useHash: true,
      relativeLinkResolution: 'corrected', // this will be default in angular 11
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
