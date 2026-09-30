/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  anything,
  capture,
  instance,
  mock,
  reset,
  verify,
  when,
} from 'ts-mockito'
import { ActionService } from '../../../../../../src/private/domain/entities/action/actionService'
import { ConfirmActionOutcomeUseCase } from '../../../../../../src/private/domain/use-cases/action/confirmActionOutcomeUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ConfirmActionOutcomeUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()

  let instanceUnderTest: ConfirmActionOutcomeUseCase

  beforeEach(() => {
    reset(mockActionService)
    instanceUnderTest = new ConfirmActionOutcomeUseCase(
      instance(mockActionService),
    )
  })

  describe('execute', () => {
    it('confirms an action outcome successfully', async () => {
      when(mockActionService.confirmOutcome(anything())).thenResolve(
        EntityDataFactory.action,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.action)
      const [idArg] = capture(mockActionService.confirmOutcome).first()
      expect(idArg).toBe('testId')
      verify(mockActionService.confirmOutcome(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockActionService.confirmOutcome(anything())).thenReject(
        new Error('service error'),
      )

      await expect(instanceUnderTest.execute('testId')).rejects.toThrow(
        'service error',
      )
    })
  })
})
