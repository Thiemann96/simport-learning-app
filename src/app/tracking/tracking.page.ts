import { Component, Input, OnInit } from '@angular/core'
import {
  BackgroundGeolocation,
  BackgroundGeolocationAuthorizationStatus,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationProvider,
  BackgroundGeolocationResponse,
} from '@ionic-native/background-geolocation/ngx'
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  @Input() state: string
  @Input() eventText: string

  private config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle. NOTE: Disabled because of https://github.com/mauron85/cordova-plugin-background-geolocation/pull/633
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  }

  constructor(
    private backgroundGeolocation: BackgroundGeolocation,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.state = 'Waiting...'
    this.logToScreen('Nothing has happened so far.')

    this.backgroundGeolocation.configure(this.config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          this.logToScreen('Last location update: ' + location.time.toString())
          this.backgroundGeolocation.finish()
        })

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.start)
        .subscribe(() => {
          this.state = 'Started'
          this.logToScreen('Set label to Started')
        })

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.stop)
        .subscribe(() => {
          this.state = 'Stopped'
          this.logToScreen('Set label to Stopped')
        })
    })
  }

  toggleBackgroundGeoLocation() {
    if (this.platform.is('ios') == false) return

    this.backgroundGeolocation.checkStatus().then((status) => {
      this.logToScreen('Checking status...')
      if (status.isRunning) {
        this.logToScreen('Running. -> Calling stop...')
        this.backgroundGeolocation.stop()
        this.logToScreen('Stop called.')
        return false
      }
      this.logToScreen('Location services enabled?')
      if (!status.locationServicesEnabled) {
        this.logToScreen('Not enabled, asking user.')
        var showSettings = confirm(
          'Location services disabled. Would you like to open app settings?'
        )
        if (showSettings) {
          return this.backgroundGeolocation.showAppSettings()
        } else return false
      }
      this.logToScreen('Permission granted?')
      if (
        status.authorization == 99 ||
        BackgroundGeolocationAuthorizationStatus.AUTHORIZED
      ) {
        this.logToScreen('About to start...')
        this.backgroundGeolocation.start()
        this.logToScreen('Start called.')
      } else {
        this.logToScreen('Show app settings.')
        var showSettings = confirm(
          'App requieres always on location permission. Please grant permission in settings.'
        )
        if (showSettings) {
          return this.backgroundGeolocation.showAppSettings()
        } else return false
      }
    })
  }

  logToScreen(message: string) {
    this.eventText += message + '\n'
  }
}
