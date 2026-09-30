/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { anything, capture, instance, mock, reset, verify } from 'ts-mockito'
import { ActionService } from '../../../../../../src/private/domain/entities/action/actionService'
import { UnsubscribeFromActionUseCase } from '../../../../../../src/private/domain/use-cases/action/unsubscribeFromActionUseCase'

describe('UnsubscribeFromActionUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()

  let instanceUnderTest: UnsubscribeFromActionUseCase

  beforeEach(() => {
    reset(mockActionService)
    instanceUnderTest = new UnsubscribeFromActionUseCase(
      instance(mockActionService),
    )
  })

  describe('execute', () => {
    it('unsubscribes by subscription id', () => {
      instanceUnderTest.execute('sub-1')

      verify(mockActionService.unsubscribe(anything())).once()
      const [idArg] = capture(mockActionService.unsubscribe).first()
      expect(idArg).toBe('sub-1')
    })
  })
})
