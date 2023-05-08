import Mqtt from '@ioc:Intellisense/Mqtt'
import Logger from '@ioc:Adonis/Core/Logger'

const topics = {
  data: '$share/g1/topic-data',
  topic: 'topic',
}

Mqtt.on('connect', () => {
  Object.values(topics).forEach((value) => {
    Mqtt.subscribe(value, () => Logger.info(`MQTT client subscribe topic: ${value}`))
  })
})

Mqtt.on('message', (topic, payload) => {
  console.log(new Date().toISOString(), topic, payload.toString())
})
