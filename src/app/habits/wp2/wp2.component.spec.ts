import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { APP_TEST_IMPORTS } from '../../app.declarations'
import { SqliteService } from '../../shared-services/db/sqlite.service'

import { WP2Component } from './wp2.component'

describe('WP1Component', () => {
  let component: WP2Component
  let fixture: ComponentFixture<WP2Component>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WP2Component],
        imports: APP_TEST_IMPORTS,
        providers: [SqliteService],
      }).compileComponents()

      fixture = TestBed.createComponent(WP2Component)
      component = fixture.componentInstance
      fixture.detectChanges()
    })
  )

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
