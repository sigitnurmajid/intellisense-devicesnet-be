import Mqtt from '@ioc:Intellisense/Mqtt'
import Logger from '@ioc:Adonis/Core/Logger'
import { matches } from 'mqtt-pattern'
import MqttWorker from 'App/Workers/MqttWorker'

const topics = {
  data: '$share/intellisense/topic-data',
  command: 'topic-command',
}

Mqtt.on('connect', () => {
  Object.values(topics).forEach((value) => {
    Mqtt.subscribe(value, () => Logger.info(`MQTT Intellisense Backend subscribe to topic: ${value}`))
  })
})

Mqtt.on('message', (topic, payload) => {
  const worker = new MqttWorker(topic, payload)
  worker.work()
})
