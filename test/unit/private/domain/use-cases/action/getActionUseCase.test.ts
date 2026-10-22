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
import { GetActionUseCase } from '../../../../../../src/private/domain/use-cases/action/getActionUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('GetActionUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()

  let instanceUnderTest: GetActionUseCase

  beforeEach(() => {
    reset(mockActionService)

    instanceUnderTest = new GetActionUseCase(instance(mockActionService))
  })

  describe('execute', () => {
    it('retrieves an action successfully', async () => {
      when(mockActionService.get(anything())).thenResolve(
        EntityDataFactory.action,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.action)
      const [idArg] = capture(mockActionService.get).first()
      expect(idArg).toBe('testId')
      verify(mockActionService.get(anything())).once()
    })

    it('returns undefined when action not found', async () => {
      when(mockActionService.get(anything())).thenResolve(undefined)

      const result = await instanceUnderTest.execute('nonExistentId')

      expect(result).toBeUndefined()
      verify(mockActionService.get(anything())).once()
    })
  })
})
