/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NotRegisteredError,
  ServiceError,
  mapGraphQLToClientError,
} from '@sudoplatform/sudo-common'
import { GraphQLError } from 'graphql'
import { ErrorTransformer } from '../../../../../src/private/data/common/transformer/errorTransformer'
import { InvalidArgumentError } from '../../../../../src/public/errors'

vi.mock('@sudoplatform/sudo-common', async () => {
  const actual = await vi.importActual('@sudoplatform/sudo-common')
  return {
    ...actual,
    mapGraphQLToClientError: vi.fn().mockReturnValue(new Error('mapped')),
  }
})

describe('ErrorTransformer Test Suite', () => {
  let instanceUnderTest: ErrorTransformer

  beforeEach(() => {
    instanceUnderTest = new ErrorTransformer()
  })

  describe('toClientError', () => {
    it('returns NotRegisteredError for IdentityContextMissing errorType', () => {
      const error = {
        errorType: 'sudoplatform.privacyinteraction.IdentityContextMissing',
        message: 'identity missing',
      }
      const result = instanceUnderTest.toClientError(error)

      expect(result).toBeInstanceOf(NotRegisteredError)
      expect(result.message).toBe('identity missing')
    })

    it('returns ServiceError for ServiceError errorType', () => {
      const error = {
        errorType: 'sudoplatform.ServiceError',
        message: 'service error occurred',
      }
      const result = instanceUnderTest.toClientError(error)

      expect(result).toBeInstanceOf(ServiceError)
      expect(result.message).toBe('service error occurred')
    })

    it('returns InvalidArgumentError for InvalidArgumentError errorType', () => {
      const error = {
        errorType: 'sudoplatform.InvalidArgumentError',
        message: 'invalid argument',
      }
      const result = instanceUnderTest.toClientError(error)

      expect(result).toBeInstanceOf(InvalidArgumentError)
      expect(result.message).toBe('invalid argument')
    })

    it('falls back to mapGraphQLToClientError for unknown errorType', () => {
      const error = {
        errorType: 'sudoplatform.UnknownError',
        message: 'something unknown',
      }
      const result = instanceUnderTest.toClientError(error)

      expect(mapGraphQLToClientError).toHaveBeenCalledWith(error)
      expect(result.message).toBe('mapped')
    })

    it('handles GraphQLError input using message as errorType', () => {
      const graphQLError = new GraphQLError('sudoplatform.ServiceError')
      const result = instanceUnderTest.toClientError(graphQLError)

      expect(result).toBeInstanceOf(ServiceError)
      expect(result.message).toBe('sudoplatform.ServiceError')
    })

    it('falls back to mapGraphQLToClientError for unknown GraphQLError', () => {
      const graphQLError = new GraphQLError('some unknown error')
      instanceUnderTest.toClientError(graphQLError)

      expect(mapGraphQLToClientError).toHaveBeenCalledWith(graphQLError)
    })
  })
})
