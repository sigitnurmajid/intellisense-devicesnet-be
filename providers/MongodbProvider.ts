import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { MongoClient } from 'mongodb'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class MongodbProvider {
  constructor(protected app: ApplicationContract) { }

  public register() {
    // Register your own bindings
    this.app.container.singleton('Intellisense/Mongodb', () => {
      const config = this.app.container.use('Adonis/Core/Config')
      const mongodb = new MongoClient(config.get('mongodb').url)
      return mongodb
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
    const mongodb = this.app.container.use('Intellisense/Mongodb')
    await mongodb.connect()
  }

  public async shutdown() {
    // Cleanup, since app is going down
    const mongodb = this.app.container.resolveBinding('Intellisense/Mongodb')
    await mongodb.disconnect()
  }
}
