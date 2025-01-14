import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { IonRouterOutlet } from '@ionic/angular'
import { APP_TEST_IMPORTS } from '../app.declarations'
import { SqliteService } from '../shared-services/db/sqlite.service'
import { LocationService } from '../shared-services/location/location.service'
import { TrajectoryImportExportService } from '../shared-services/trajectory/trajectory-import-export.service'
import { TrajectoryService } from '../shared-services/trajectory/trajectory.service'
import { SelectTrajectoryPage } from './select-trajectory.page'

describe('SelectTrajectoryPage', () => {
  let component: SelectTrajectoryPage
  let fixture: ComponentFixture<SelectTrajectoryPage>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTrajectoryPage],
      imports: APP_TEST_IMPORTS,
      providers: [
        LocationService,
        BackgroundGeolocation,
        SqliteService,
        TrajectoryService,
        TrajectoryImportExportService,
        SocialSharing,
        {
          // use empty IonRouterOutlet, since actually providing IonRouterOutlet
          // creates a conflict with RouterTestingModule and this is sufficent for running tests.
          provide: IonRouterOutlet,
          useValue: { nativeEl: '' },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SelectTrajectoryPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
