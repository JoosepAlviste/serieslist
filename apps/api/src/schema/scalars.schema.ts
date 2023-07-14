import { LocalDateResolver } from 'graphql-scalars'

import { builder } from '@/schemaBuilder'

builder.addScalarType('Date', LocalDateResolver, {})
