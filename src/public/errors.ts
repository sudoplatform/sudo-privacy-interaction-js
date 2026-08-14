/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

class PrivacyInteractionError extends Error {
  constructor(msg?: string) {
    super(msg)
    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export class InvalidArgumentError extends PrivacyInteractionError {
  constructor(msg?: string) {
    super(msg)
  }
}

export class PrivacyInteractionServiceConfigNotFoundError extends PrivacyInteractionError {
  constructor(msg?: string) {
    super(msg)
  }
}
