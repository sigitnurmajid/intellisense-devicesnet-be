import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Device from 'App/Models/Device'
import Type from 'App/Models/Type'
import CreateDeviceValidator from 'App/Validators/Device/CreateDeviceValidator'
import UpdateDeviceValidator from 'App/Validators/Device/UpdateDeviceValidator'

export default class DevicesController {
  public async index({ response }: HttpContextContract) {
    const devices = await Device.query().preload('type')
    return response.ok({ status: 'success', data: { devices } })
  }

  public async store({ response, request }: HttpContextContract) {
    const payload = await request.validate(CreateDeviceValidator)
    const type = await Type.findOrFail(payload.type_id)

    for (const key in payload.fields) {
      const checkKey = type.fields.fields.find((element: string) => element === key)
      if (checkKey === undefined) return response.badRequest({ status: 'fail', message: 'Key not match' })
    }

    const device = await type.related('devices').create({
      name: payload.name,
      fields: payload.fields
    })
    return response.ok({ status: 'success', data: { device } })
  }

  public async show({ response, params }: HttpContextContract) {
    const device = await Device.findOrFail(params.id)
    await device?.load('type')
    return response.ok({ status: 'success', data: { device } })
  }

  public async update({ request, response, params }: HttpContextContract) {
    const payload = await request.validate(UpdateDeviceValidator)
    const device = await Device.findOrFail(params.id)
    const type = await Type.findOrFail(device.typeId)

    for (const key in payload.fields) {
      const checkKey = type.fields.fields.find((element: string) => element === key)
      if (checkKey === undefined) return response.badRequest({ status: 'fail', message: 'Key not match' })
    }

    await device.merge({
      name: payload.name != undefined ? payload.name : type.name,
      fields: payload.fields != undefined ? payload.fields : device.fields
    }).save()

    return response.ok({ status: 'success', data: { device } })
  }

  public async destroy({ response, params }: HttpContextContract) {
    const device = await Device.findOrFail(params.id)
    await device.delete()
    return response.ok({ status: 'success', data: null })
  }
}
