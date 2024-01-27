import { builder } from '@serieslist/graphql-server'
import { LocalDateResolver } from 'graphql-scalars'

builder.addScalarType('Date', LocalDateResolver, {})
