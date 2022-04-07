import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { APP_TEST_IMPORTS } from '../../app.declarations'
import { SqliteService } from '../../shared-services/db/sqlite.service'

import { WP1Component } from './wp1.component'

describe('WP1Component', () => {
  let component: WP1Component
  let fixture: ComponentFixture<WP1Component>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WP1Component],
        imports: APP_TEST_IMPORTS,
        providers: [SqliteService],
      }).compileComponents()

      fixture = TestBed.createComponent(WP1Component)
      component = fixture.componentInstance
      fixture.detectChanges()
    })
  )

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
