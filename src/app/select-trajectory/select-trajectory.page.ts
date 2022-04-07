import { Component } from '@angular/core'
import { Router } from '@angular/router'
import {
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular'
import { ToastButton } from '@ionic/core'
import { TranslateService } from '@ngx-translate/core'
import { DebugWindowComponent } from '../debug-window/debug-window.component'
import { TrajectoryMeta, TrajectoryType } from '../model/trajectory'
import { LocationService } from '../shared-services/location/location.service'
import { TrajectoryImportExportService } from '../shared-services/trajectory/trajectory-import-export.service'
import { TrajectorySelectorComponent } from './trajectory-selector/trajectory-selector.component'

enum TrajectoryMode {
  TRACK = 'tracking',
  CHOOSE = 'choose',
  IMPORT = 'import',
}

@Component({
  selector: 'app-select-trajectory',
  templateUrl: './select-trajectory.page.html',
  styleUrls: ['./select-trajectory.page.scss'],
})
export class SelectTrajectoryPage {
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private trajectoryImportExportService: TrajectoryImportExportService,
    public locationService: LocationService,
    public translateService: TranslateService
  ) {}

  private CLICK_INTERVAL = 500
  private DEBUG_WINDOW_CLICKS = 8
  private lastOnClicks = [] // contains timestamps of title clicks, newest comes first
  TrajectoryMode: typeof TrajectoryMode = TrajectoryMode // for usage in template

  // fired on title click
  // used for multiple click detection
  async onTitleClick() {
    const lastClick = this.lastOnClicks[0]
    const now = Date.now()

    // the last click was too long ago, reset state
    if (!lastClick || now - lastClick > this.CLICK_INTERVAL) {
      this.lastOnClicks = [now]
      return
    }

    const toasts = [
      { message: '🦖🎉 You found the secret debug window!', duration: 1000 },
      { message: '🦉 You are 1 click away from the debug window' },
      { message: '🐬 You are 2 clicks away from the debug window' },
      { message: '🦘 You are 3 clicks away from the debug window' },
    ]

    // notify the user when they are 3, 2 or 1 click(s) away from the debug window
    // adapted from the android developer settings
    this.lastOnClicks.unshift(now)
    const clicksAway = this.DEBUG_WINDOW_CLICKS - this.lastOnClicks.length
    if (toasts[clicksAway]) {
      const toast = await this.toastController.create({
        duration: 500,
        ...toasts[clicksAway],
      })
      toast.present()
    }

    // all clicks were in the required interval
    // presenting debug modal
    if (clicksAway === 0) {
      this.lastOnClicks = []
      const modal = await this.modalController.create({
        component: DebugWindowComponent,
        swipeToClose: false,
        backdropDismiss: false,
        presentingElement: this.routerOutlet.nativeEl,
        cssClass: 'auto-height',
      })
      modal.present()
    }
  }

  async enableTrajectory(mode: TrajectoryMode) {
    // TODO: persist selected mode

    switch (mode) {
      case TrajectoryMode.TRACK:
        this.router.navigate(['/tracking'])
        return

      case TrajectoryMode.CHOOSE:
        const modal = await this.modalController.create({
          component: TrajectorySelectorComponent,
          swipeToClose: true,
          presentingElement: this.routerOutlet.nativeEl,
          cssClass: 'auto-height',
        })
        modal.present()
        const { data: t } = await modal.onWillDismiss<TrajectoryMeta>()
        if (t) this.router.navigate([`/trajectory/${t.type}/${t.id}`])
        return

      case TrajectoryMode.IMPORT:
        await this.trajectoryImportExportService
          .selectAndImportTrajectory(async () => {
            // did select file
            const dialogMessage = this.translateService.instant(
              'trajectory.import.loadingDialogMessage'
            )
            await this.showLoadingDialog(dialogMessage)
          })
          .then(async (result) => {
            await this.hideLoadingDialog()
            if (result.success) {
              const viewString = this.translateService.instant('general.view')
              const viewTrajectoryButton = {
                text: viewString,
                handler: async () => {
                  this.router.navigate([
                    `/trajectory/${TrajectoryType.IMPORT}/${result.trajectoryId}`,
                  ])
                },
              }
              const toastMessage = this.translateService.instant(
                'trajectory.import.successfulMessage'
              )
              await this.showToastWithButtons(toastMessage, false, [
                viewTrajectoryButton,
              ])
            } else {
              await this.showToast(result.errorMessage, true)
            }
          })
        return

      default:
        return
    }
  }

  navigateToDiary() {
    this.router.navigate(['/diary'])
  }

  navigateToHabits() {
    this.router.navigate(['/habits'])
  }
  private async showToast(message: string, isError: boolean) {
    await this.showToastWithButtons(message, isError, [])
  }

  private async showToastWithButtons(
    message: string,
    isError: boolean,
    buttons: ToastButton[]
  ) {
    const toast = await this.toastController.create({
      message,
      color: isError ? 'danger' : 'success',
      duration: buttons.length > 0 ? 4000 : 2000,
      buttons,
    })
    toast.present()
  }

  private async showLoadingDialog(message: string) {
    const loading = await this.loadingController.create({
      message,
      translucent: true,
    })
    await loading.present()
  }

  private async hideLoadingDialog() {
    await this.loadingController.dismiss()
  }
}
