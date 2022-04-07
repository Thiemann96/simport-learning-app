import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import * as L from 'leaflet'

interface GeoLifeTrajectory {
  latslngs: [number, number][]
  dates: [string, string][]
}

@Component({
  selector: 'app-wp1',
  templateUrl: './wp1.component.html',
  styleUrls: ['./wp1.component.scss'],
})
export class WP1Component {
  file: any
  fileContent: string
  latslngs = []
  trajectoryLayer: any
  trajectories: Array<GeoLifeTrajectory> = []
  private map

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.9, 116.4],
      zoom: 10,
    })

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    )

    tiles.addTo(this.map)
  }

  constructor(private translateService: TranslateService) {}

  ionViewDidEnter(): void {
    this.initMap()
  }

  initEveryTrajectory(): void {}

  fileChanged(e): void {
    this.file = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      this.fileContent = fileReader.result as string
      this.parseCSVTrajectory(this.fileContent)
      this.trajectoryLayer = L.layerGroup()
      this.loadToMap(this.trajectories[0])
    }
    fileReader.readAsText(this.file)
  }

  loadToMap(trajectory) {
    console.log(trajectory)
    const trajectoryLayer = L.layerGroup()
    trajectory.latslngs.map((point, index) => {
      let color
      switch (index) {
        case 0:
          color = '#00c853' // green
          break
        case trajectory.latslngs.length - 1:
          color = '#d50000' // red
          break
        default:
          color = '#6200ea'
          break
      }
      L.circle(trajectory, { radius: 15, color }).addTo(trajectoryLayer)
    })
    const polyline = L.polyline(trajectory.latslngs, { color: 'blue' }).addTo(
      trajectoryLayer
    )
    trajectoryLayer.addTo(this.map)
    this.map.fitBounds(polyline.getBounds())
  }

  clearMap() {
    this.map.eachLayer((layer) => {
      if (layer._url !== 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') {
        layer.remove()
      }
    })
  }

  parseCSVTrajectory(csv): void {
    let csvArray = []
    // lat, lng, alti, date string, time string
    const latslngs = []
    const dates = []
    csvArray = csv.split('\n')
    csvArray.splice(0, 6)

    // map array and extract lats lngs for leaflet
    csvArray.map((point, index) => {
      if (index !== csvArray.length - 1) {
        const pointArr = point.split(',')
        latslngs.push([pointArr[0], pointArr[1]])
        dates.push([pointArr[5], pointArr[6]])
      }
    })
    // remove last value
    this.latslngs.splice(this.latslngs.length - 1, 1)
    const trajectory = {
      latslngs,
      dates,
    }

    this.trajectories.push(trajectory)
  }
}
