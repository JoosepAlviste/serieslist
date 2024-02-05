import { builder } from '@serieslist/core-graphql-server'
import { LocalDateResolver } from 'graphql-scalars'

builder.addScalarType('Date', LocalDateResolver, {})
