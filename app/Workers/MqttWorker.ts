import { Point } from '@influxdata/influxdb-client'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
// import Influx from '@ioc:Intellisense/Influx'
import Logger from '@ioc:Adonis/Core/Logger'

interface IPoint {
  measurement: string,
  tags: Object,
  fields: Object
}

interface ISchema {
  device: string
  points: Array<IPoint>
}

export default class MqttWorker {
  constructor(public topic: string, public payload: Buffer) { }

  public async work() {
    // Validate json from device
    const data = await this.validate(this.payload.toString())

    // Build json into Point Influx
    if(data === undefined) return
    const points = this.build(data)

    console.log(points)
    
    // Store Point Influx to InfluxDB
    // this.store(points)
  }

  private async validate(payload: string) {
    const jsonSchema = schema.create({
      device: schema.string({}, [
        rules.exists({ table: 'devices', column: 'name' })
      ]),
      points: schema.array().members(
        schema.object().members({
          measurement: schema.string(),
          tags: schema.object().anyMembers(),
          fields: schema.object().anyMembers()
        }
        )
      )
    })

    try {
      return await validator.validate({
        schema: jsonSchema,
        data: JSON.parse(payload)
      })
    } catch (error) {
      Logger.error(error)
    }
  }

  private build(data: ISchema): Array<Point> {
    const points = data.points.map(x => {
      const point = new Point(x.measurement)

      point.tag('device_name', data.device)
      Object.entries(x.tags).forEach(([key, value]) => {
        point.tag(key, value)
      })

      Object.entries(x.fields).forEach(([key, value]) => {
        switch (typeof value) {
          case 'string':
            point.stringField(key, value)
            break
          case 'number':
            Number.isInteger(value) ? point.intField(key, value) : point.floatField(key, value)
            break
        }
      })

      return point
    })

    return points
  }

  // private async store(points: Array<Point>) {
  //   try {
  //     await Influx.writePoints(points)
  //   } catch (error) {
  //     Logger.error(error.message)
  //   }
  // }
}