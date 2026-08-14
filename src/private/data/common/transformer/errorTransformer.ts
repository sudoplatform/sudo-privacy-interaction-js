/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultLogger,
  Logger,
  NotRegisteredError,
  ServiceError,
  mapGraphQLToClientError,
} from '@sudoplatform/sudo-common'
import { GraphQLError } from 'graphql'
import { InvalidArgumentError } from '../../../../public/errors'

export class ErrorTransformer {
  private readonly log: Logger

  constructor() {
    this.log = new DefaultLogger(this.constructor.name)
  }

  toClientError(
    error:
      { errorType: string; errorInfo?: string; message: string } | GraphQLError,
  ): Error {
    const errorType = 'errorType' in error ? error.errorType : error.message
    switch (errorType) {
      case 'sudoplatform.privacyinteraction.IdentityContextMissing':
        return new NotRegisteredError(error.message)
      case 'sudoplatform.ServiceError':
        return new ServiceError(error.message)
      case 'sudoplatform.InvalidArgumentError':
        return new InvalidArgumentError(error.message)
      default:
        return mapGraphQLToClientError(error)
    }
  }
}
