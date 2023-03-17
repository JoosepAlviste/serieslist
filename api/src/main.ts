import { server } from './server.js'

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
