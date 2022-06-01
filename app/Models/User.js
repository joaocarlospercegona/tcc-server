'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { getUsuarioPerfis } = use('App/Helpers')
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
     this.addHook('beforeSave', async (usuarioInstance) => {
      if (usuarioInstance.dirty.password) {
        usuarioInstance.password = await Hash.make(usuarioInstance.password)
      }
      if (usuarioInstance.id) usuarioInstance.perfis = undefined
    })
    
    this.addHook('afterFind', async (usuarioInstance) => {
      usuarioInstance.perfis = await getUsuarioPerfis(usuarioInstance)
    })

    this.addHook('afterFetch', async (data) => {
      for (let usuarioInstance of data)
        usuarioInstance.perfis = await getUsuarioPerfis(usuarioInstance)
    })

    this.addHook('afterPaginate', async (data) => {
      for (let usuarioInstance of data)
        usuarioInstance.perfis = await getUsuarioPerfis(usuarioInstance)
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
  static get hidden() {
    return ['password']
  }

  atleta () {
    return this.belongsTo('App/Models/Atleta', 'id', 'user_id')
  }

  treinador () {
    return this.belongsTo('App/Models/Treinador', 'id', 'user_id')
  }

  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }
}

module.exports = User
