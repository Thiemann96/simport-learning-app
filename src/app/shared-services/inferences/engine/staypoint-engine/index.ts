import { Inference } from 'src/app/model/inference'
import { StayPoints } from 'src/app/model/staypoints'
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
import { StaypointDetector } from 'src/app/shared-services/staypoint/staypoint-detector'
import {
  inferHomeFromStayPointClusters,
  inferWorkFromStayPointClusters,
} from 'src/app/shared-services/staypoint/utils'
import { StaypointClusterer } from 'src/app/shared-services/staypoint/staypoint-clusterer'
import { StaypointService } from 'src/app/shared-services/staypoint/staypoint.service'

export class StaypointEngine implements IInferenceEngine {
  scorings: IInferenceScoring[] = [
    new NightnessScoring(),
    new WorkHoursScoring(),
  ]

  private staypointDetector: StaypointDetector = new StaypointDetector()
  private staypointClusterer: StaypointClusterer = new StaypointClusterer()
  private inputCoordinatesLimit = 100000

  infer(
    trajectory: Trajectory,
    inferences: InferenceDefinition[]
  ): InferenceResult {
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

    const stayPointData = this.staypointDetector.detectStayPoints(
      trajectory,
      StaypointService.DIST_THRESH_METERS,
      StaypointService.TIME_THRESH_MINUTES
    )

    const stayPoints: StayPoints = {
      trajID: trajectory.id,
      coordinates: stayPointData.coordinates,
      starttimes: stayPointData.starttimes,
      endtimes: stayPointData.endtimes,
    }

    const stayPointClusters = this.staypointClusterer.clusterStayPoints(
      stayPoints,
      StaypointService.CLUSTERING_NEIGHBORHOOD_RADIUS,
      StaypointService.CLUSTERING_POINTS_IN_NEIGHBORHOOD
    )
    const inferenceResults = inferences
      .map((i) => {
        if (i.type === InferenceType.home) {
          return inferHomeFromStayPointClusters(stayPointClusters)
        }
        if (i.type === InferenceType.work) {
          return inferWorkFromStayPointClusters(stayPointClusters)
        }
      })
      .filter((i) => i) // filter undefined values

    return {
      status:
        inferenceResults.length === 0
          ? InferenceResultStatus.noInferencesFound
          : InferenceResultStatus.successful,
      inferences: inferenceResults,
    }
  }
}
