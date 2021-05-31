import { AllInferences } from '../shared-services/inferences/engine/definitions'
import { InferenceType } from '../shared-services/inferences/engine/types'

export class Inference {
  constructor(
    public name: string,
    public type: InferenceType,
    public description: string,
    public trajectoryId: string,
    public latLng: [number, number],
    public confidence?: number,
    public accuracy?: number
  ) {}

  static fromObject(val: any) {
    const {
      name,
      type,
      description,
      trajectory,
      lat,
      lon,
      confidence,
      accuracy,
    } = val

    return new Inference(
      name,
      type,
      description,
      trajectory,
      [lat, lon],
      confidence,
      accuracy
    )
  }

  get icon(): string {
    return AllInferences[this.type].icon
  }

  get outlinedIcon(): string {
    return AllInferences[this.type].outlinedIcon
  }
}
