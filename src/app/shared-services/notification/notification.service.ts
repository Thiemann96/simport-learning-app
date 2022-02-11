import { Injectable } from '@angular/core'
import { NotificationType } from './types'
import { LocalNotifications } from '@capacitor/local-notifications'

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {
    this.checkPermission()
  }

  private checkPermission() {
    LocalNotifications.requestPermissions().then((permissionResponse) => {
      console.log(
        'notification permission granted: ' +
          (permissionResponse.display === 'granted')
      )
    })
  }

  notify(type: NotificationType, title: string, text: string) {
    LocalNotifications.schedule({
      notifications: [
        {
          id: type,
          title,
          body: text,
        },
      ],
    })
  }
}
