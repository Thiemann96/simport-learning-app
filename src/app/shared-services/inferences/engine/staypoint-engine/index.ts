import { Inference } from 'src/app/model/inference'
import { Trajectory } from 'src/app/model/trajectory'
import {
  IInferenceEngine,
  InferenceDefinition,
  InferenceResult,
  InferenceResultStatus,
  InferenceType,
} from '../types'
import { NightnessScoring } from '../../scoring/nightness-scoring'
import { IInferenceScoring } from '../../scoring/types'
import { WorkHoursScoring } from '../../scoring/work-hours-scoring'
import {
  inferHomeFromStayPointClusters,
  inferWorkFromStayPointClusters,
} from 'src/app/shared-services/staypoint/utils'
import { StaypointService } from 'src/app/shared-services/staypoint/staypoint.service'

export class StaypointEngine implements IInferenceEngine {
  scorings: IInferenceScoring[] = [
    new NightnessScoring(),
    new WorkHoursScoring(),
  ]

  constructor(private staypointService: StaypointService) {}

  private inputCoordinatesLimit = 100000

  async infer(
    trajectory: Trajectory,
    inferences: InferenceDefinition[]
  ): Promise<InferenceResult> {
    if (trajectory.coordinates.length > this.inputCoordinatesLimit) {
      return {
        status: InferenceResultStatus.tooManyCoordinates,
        inferences: [],
      }
    }

    if (trajectory.coordinates.length === 0) {
      return {
        status: InferenceResultStatus.noInferencesFound,
        inferences: [],
      }
    }

    const daysInTrajectory = this.countDays(trajectory)
    const weekDaysInTrajectory = this.countWeekDays(trajectory)

    await this.staypointService.updateStayPoints(trajectory.type, trajectory.id)
    const stayPoints = await this.staypointService.getStayPoints(trajectory.id)
    const stayPointClusters =
      await this.staypointService.computeStayPointClusters(stayPoints)

    const inferenceResultsNested = inferences.map((i) => {
      if (i.type === InferenceType.home) {
        return inferHomeFromStayPointClusters(
          stayPointClusters,
          daysInTrajectory
        )
      }
      if (i.type === InferenceType.work) {
        return inferWorkFromStayPointClusters(
          stayPointClusters,
          weekDaysInTrajectory
        )
      }
    })
    // flatten and filter
    const inferenceResults: Inference[] = [].concat
      .apply([], inferenceResultsNested)
      .filter((i) => i)

    return {
      status:
        inferenceResults.length === 0
          ? InferenceResultStatus.noInferencesFound
          : InferenceResultStatus.successful,
      inferences: inferenceResults,
    }
  }

  private countDays(trajectory: Trajectory): number {
    // TODO update this method when start/stop are encoded in trajectory
    const diffMs =
      trajectory.timestamps[trajectory.timestamps.length - 1].getTime() -
      trajectory.timestamps[0].getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    // we round up as half a day can also get counted as a work/home day in scoring
    return Math.floor(diffDays) + 1
  }

  private countWeekDays(trajectory: Trajectory): number {
    // TODO update this method when start/stop are encoded in trajectory
    let count = 0
    const endDate = new Date(
      trajectory.timestamps[trajectory.timestamps.length - 1].getTime()
    )
    const currentDate = new Date(trajectory.timestamps[0].getTime())
    while (currentDate <= endDate) {
      if (!(currentDate.getDay() in [0, 6])) count += 1
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return count
  }
}
