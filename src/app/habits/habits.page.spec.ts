import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { APP_TEST_IMPORTS } from '../app.declarations'
import { SqliteService } from '../shared-services/db/sqlite.service'

import { HabitsPage } from './habits.page'

describe('HabitsPage', () => {
  let component: HabitsPage
  let fixture: ComponentFixture<HabitsPage>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HabitsPage],
        imports: APP_TEST_IMPORTS,
        providers: [SqliteService],
      }).compileComponents()

      fixture = TestBed.createComponent(HabitsPage)
      component = fixture.componentInstance
      fixture.detectChanges()
    })
  )

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
