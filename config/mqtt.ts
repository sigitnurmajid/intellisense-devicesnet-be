import Env from '@ioc:Adonis/Core/Env'

const config = {
  host: Env.get('MQTT_HOST', 'localhost'),
  username: Env.get('MQTT_USER'),
  password: Env.get('MQTT_PASSWORD'),
  clientId: Env.get(
    'MQTT_CLIENT_ID',
    'intellisense-device-net-' + Math.random().toString(16).substring(0)
  ),
  port: Env.get('MQTT_PORT', '1883'),
  rejectUnauthorized: false,
  healthCheck: true,
  protocolVersion: 5,
}

export default config
