import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class InferenceService {
  private inferences: Inference[] = [
    { name: 'Home', description: 'We do now know where your home is.' },
    { name: 'Workplace', description: 'We know where you work.' },
  ]
  constructor() {}

  getInferences(trajectoryId?: string) {
    return this.inferences
  }
}
