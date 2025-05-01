import { transformBoundingBoxAndElement } from './transformBoundingBoxAndElement'
import { Box2D } from './box2d'
import {
  DwgArcEntity,
  DwgCircleEntity,
  DwgDatabase,
  DwgEllipseEntity,
  DwgEntity,
  DwgLayerTableEntry,
  DwgLineEntity,
  DwgLWPolylineEntity,
  DwgPoint2D,
  DwgPolylineEntity,
  DwgSplineEntity
} from '../database'
import { Color } from './color'
import { evaluateBSpline } from './bspline'

export class SvgConverter {
  private rotate(point: DwgPoint2D, angle: number) {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos
    }
  }

  /**
   * Interpolates a B-spline curve and returns the resulting polyline.
   *
   * @param controlPoints The control points of the B-spline.
   * @param degree The degree of the B-spline.
   * @param knots The knot vector.
   * @param interpolationsPerSplineSegment Number of interpolated points per spline segment.
   * @param weights Optional weight vector for rational B-splines.
   * @returns An array of interpolated 2D points representing the polyline.
   */
  private interpolateBSpline(
    controlPoints: DwgPoint2D[],
    degree: number,
    knots: number[],
    interpolationsPerSplineSegment: number = 25,
    weights?: number[]
  ): DwgPoint2D[] {
    const polyline: DwgPoint2D[] = []

    const controlPointsForLib: number[][] = controlPoints.map(
      (p: DwgPoint2D) => [p.x, p.y]
    )

    const segmentTs: number[] = [knots[degree]]
    const domain: [number, number] = [
      knots[degree],
      knots[knots.length - 1 - degree]
    ]

    for (let k = degree + 1; k < knots.length - degree; ++k) {
      if (segmentTs[segmentTs.length - 1] !== knots[k]) {
        segmentTs.push(knots[k])
      }
    }

    for (let i = 1; i < segmentTs.length; ++i) {
      const uMin: number = segmentTs[i - 1]
      const uMax: number = segmentTs[i]

      for (let k = 0; k <= interpolationsPerSplineSegment; ++k) {
        const u: number =
          (k / interpolationsPerSplineSegment) * (uMax - uMin) + uMin
        let t: number = (u - domain[0]) / (domain[1] - domain[0])
        t = Math.max(0, Math.min(1, t)) // Clamp t to [0, 1]

        const p: number[] = evaluateBSpline(
          t,
          degree,
          controlPointsForLib,
          knots,
          weights
        )
        polyline.push({ x: p[0], y: p[1] })
      }
    }

    return polyline
  }

  private addFlipXIfApplicable(
    entity: any,
    { bbox, element }: { bbox: Box2D; element: string }
  ) {
    if (entity.extrusionZ === -1) {
      return {
        bbox: new Box2D()
          .expandByPoint({ x: -bbox.min.x, y: bbox.min.y })
          .expandByPoint({ x: -bbox.max.x, y: bbox.max.y }),
        element: `<g transform="matrix(-1 0 0 1 0 0)">${element}</g>`
      }
    } else {
      return { bbox, element }
    }
  }

  private line(entity: DwgLineEntity) {
    const bbox = new Box2D()
      .expandByPoint({ x: entity.startPoint.x, y: entity.startPoint.y })
      .expandByPoint({ x: entity.endPoint.x, y: entity.endPoint.y })
    const element = `<line x1="${entity.startPoint.x}" y1="${entity.startPoint.y}" x2="${entity.endPoint.x}" y2="${entity.endPoint.y}" />`
    return transformBoundingBoxAndElement(bbox, element)
  }

  private polyline(vertices: DwgPoint2D[]) {
    const bbox = vertices.reduce(
      (acc: Box2D, point: DwgPoint2D) => acc.expandByPoint(point),
      new Box2D()
    )
    const d = vertices.reduce((acc: string, point: DwgPoint2D, i: number) => {
      acc += i === 0 ? 'M' : 'L'
      acc += point.x + ',' + point.y
      return acc
    }, '')
    return transformBoundingBoxAndElement(
      bbox,
      `<path d="${d}" />`
    )
  }

  private circle(entity: any) {
    const bbox0 = new Box2D()
      .expandByPoint({ x: entity.x + entity.r, y: entity.y + entity.r })
      .expandByPoint({ x: entity.x - entity.r, y: entity.y - entity.r })
    const element0 = `<circle cx="${entity.x}" cy="${entity.y}" r="${entity.r}" />`
    const { bbox, element } = this.addFlipXIfApplicable(entity, {
      bbox: bbox0,
      element: element0
    })
    return transformBoundingBoxAndElement(bbox, element, entity.transforms)
  }

  private ellipseOrArc(
    cx: number,
    cy: number,
    majorX: number,
    majorY: number,
    axisRatio: number,
    startAngle: number,
    endAngle: number
  ) {
    const rx = Math.sqrt(majorX * majorX + majorY * majorY)
    const ry = axisRatio * rx
    const rotationAngle = -Math.atan2(-majorY, majorX)

    const bbox = this.bboxEllipseOrArc(
      cx,
      cy,
      majorX,
      majorY,
      axisRatio,
      startAngle,
      endAngle
    )

    if (
      Math.abs(startAngle - endAngle) < 1e-9 ||
      Math.abs(startAngle - endAngle + Math.PI * 2) < 1e-9
    ) {
      const element = `<g transform="rotate(${
        (rotationAngle / Math.PI) * 180
      } ${cx}, ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" /></g>`
      return { bbox, element }
    } else {
      const startOffset = this.rotate(
        { x: Math.cos(startAngle) * rx, y: Math.sin(startAngle) * ry },
        rotationAngle
      )
      const startPoint = { x: cx + startOffset.x, y: cy + startOffset.y }
      const endOffset = this.rotate(
        { x: Math.cos(endAngle) * rx, y: Math.sin(endAngle) * ry },
        rotationAngle
      )
      const endPoint = { x: cx + endOffset.x, y: cy + endOffset.y }
      const adjustedEndAngle =
        endAngle < startAngle ? endAngle + Math.PI * 2 : endAngle
      const largeArcFlag = adjustedEndAngle - startAngle < Math.PI ? 0 : 1
      const d = `M ${startPoint.x} ${startPoint.y} A ${rx} ${ry} ${
        (rotationAngle / Math.PI) * 180
      } ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`
      const element = `<path d="${d}" />`
      return { bbox, element }
    }
  }

  private bboxEllipseOrArc(
    cx: number,
    cy: number,
    majorX: number,
    majorY: number,
    axisRatio: number,
    startAngle: number,
    endAngle: number
  ) {
    while (startAngle < 0) startAngle += Math.PI * 2
    while (endAngle <= startAngle) endAngle += Math.PI * 2

    const angles: number[] = []
    if (Math.abs(majorX) < 1e-12 || Math.abs(majorY) < 1e-12) {
      for (let i = 0; i < 4; i++) {
        angles.push((i / 2) * Math.PI)
      }
    } else {
      angles[0] = Math.atan((-majorY * axisRatio) / majorX) - Math.PI
      angles[1] = Math.atan((majorX * axisRatio) / majorY) - Math.PI
      angles[2] = angles[0] - Math.PI
      angles[3] = angles[1] - Math.PI
    }

    for (let i = 4; i >= 0; i--) {
      while (angles[i] < startAngle) angles[i] += Math.PI * 2
      if (angles[i] > endAngle) {
        angles.splice(i, 1)
      }
    }

    angles.push(startAngle)
    angles.push(endAngle)

    const pts = angles.map(a => ({ x: Math.cos(a), y: Math.sin(a) }))

    const M = [
      [majorX, -majorY * axisRatio],
      [majorY, majorX * axisRatio]
    ]

    const rotatedPts = pts.map(p => ({
      x: p.x * M[0][0] + p.y * M[0][1] + cx,
      y: p.x * M[1][0] + p.y * M[1][1] + cy
    }))

    const bbox = rotatedPts.reduce(
      (acc: Box2D, p: { x: number; y: number }) => {
        acc.expandByPoint(p)
        return acc
      },
      new Box2D()
    )

    return bbox
  }

  private ellipse(entity: any) {
    const { bbox: bbox0, element: element0 } = this.ellipseOrArc(
      entity.x,
      entity.y,
      entity.majorX,
      entity.majorY,
      entity.axisRatio,
      entity.startAngle,
      entity.endAngle
    )
    const { bbox, element } = this.addFlipXIfApplicable(entity, {
      bbox: bbox0,
      element: element0
    })
    return transformBoundingBoxAndElement(bbox, element, entity.transforms)
  }

  private arc(entity: any) {
    const { bbox: bbox0, element: element0 } = this.ellipseOrArc(
      entity.x,
      entity.y,
      entity.r,
      0,
      1,
      entity.startAngle,
      entity.endAngle
    )
    const { bbox, element } = this.addFlipXIfApplicable(entity, {
      bbox: bbox0,
      element: element0
    })
    return transformBoundingBoxAndElement(bbox, element, entity.transforms)
  }

  private entityToBoundsAndElement(entity: DwgEntity) {
    switch (entity.type) {
      case 'CIRCLE':
        return this.circle(entity as DwgCircleEntity)
      case 'ELLIPSE':
        return this.ellipse(entity as DwgEllipseEntity)
      case 'ARC':
        return this.arc(entity as DwgArcEntity)
      case 'SPLINE': {
        const spline = entity as DwgSplineEntity
        return this.polyline(
          this.interpolateBSpline(
            spline.controlPoints,
            spline.degree,
            spline.knots,
            25,
            spline.weights
          )
        )
      }
      case 'LINE':
        return this.line(entity as DwgLineEntity)
      case 'LWPOLYLINE':
        return this.polyline((entity as DwgLWPolylineEntity).vertices)
      case 'POLYLINE':
        return this.polyline((entity as DwgPolylineEntity).vertices)
      default:
        return null
    }
  }

  private getEntityColor(
    layers: DwgLayerTableEntry[],
    entity: DwgEntity
  ): Color {
    // Get entity color
    const color = new Color()
    if (entity.color != null) {
      color.color = entity.color
    }
    if (entity.colorIndex != null) {
      color.colorIndex = entity.colorIndex
    }
    if (entity.colorName != null) {
      color.colorName = entity.colorName
    }

    // If color is 'byLayer', use the layer color
    if (color.isByLayer) {
      const layer = layers.find(
        (layer: DwgLayerTableEntry) => layer.name === entity.layer
      )
      if (layer != null) {
        color.colorIndex = layer.colorIndex
      }
    }
    if (color.color == null) {
      color.color = 0xffffff
    }
    return color
  }

  public convert(dwg: DwgDatabase) {
    const entities = dwg.entities
    const { bbox, elements } = entities.reduce(
      (acc: { bbox: Box2D; elements: string[] }, entity: DwgEntity) => {
        const color = this.getEntityColor(dwg.tables.LAYER.entries, entity)
        const boundsAndElement = this.entityToBoundsAndElement(entity)
        if (boundsAndElement) {
          const { bbox, element } = boundsAndElement
          if (bbox.valid) {
            acc.bbox.expandByPoint(bbox.min)
            acc.bbox.expandByPoint(bbox.max)
          }
          acc.elements.push(`<g stroke="${color.cssColor}">${element}</g>`)
        }
        return acc
      },
      {
        bbox: new Box2D(),
        elements: []
      }
    )

    const viewBox = bbox.valid
      ? {
          x: bbox.min.x,
          y: -bbox.max.y,
          width: bbox.max.x - bbox.min.x,
          height: bbox.max.y - bbox.min.y
        }
      : {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
    return `<?xml version="1.0"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
  preserveAspectRatio="xMinYMin meet"
  viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}"
  width="100%" height="100%"
>
  <g stroke="#000000" stroke-width="0.1%" fill="none" transform="matrix(1,0,0,-1,0,0)">
    ${elements.join('\n')}
  </g>
</svg>`
  }
}
