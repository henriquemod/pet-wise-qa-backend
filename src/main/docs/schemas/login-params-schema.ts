export const loginParamsSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    email: {
      type: 'string'
    }
  },
  required: ['username', 'password', 'email']
}
