import { server } from './server'

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
