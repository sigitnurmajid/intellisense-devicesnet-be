import Env from '@ioc:Adonis/Core/Env'

const config = {
  url: Env.get('DATABASE_URL')
}

export default config