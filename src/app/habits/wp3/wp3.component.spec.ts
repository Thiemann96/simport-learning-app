import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { APP_TEST_IMPORTS } from '../../app.declarations'
import { SqliteService } from '../../shared-services/db/sqlite.service'

import { WP3Component } from './wp3.component'

describe('WP1Component', () => {
  let component: WP3Component
  let fixture: ComponentFixture<WP3Component>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WP3Component],
        imports: APP_TEST_IMPORTS,
        providers: [SqliteService],
      }).compileComponents()

      fixture = TestBed.createComponent(WP3Component)
      component = fixture.componentInstance
      fixture.detectChanges()
    })
  )

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
