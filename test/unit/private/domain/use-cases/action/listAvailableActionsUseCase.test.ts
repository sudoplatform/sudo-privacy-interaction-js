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
import { ListAvailableActionsUseCase } from '../../../../../../src/private/domain/use-cases/action/listAvailableActionsUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ListAvailableActionsUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()

  let instanceUnderTest: ListAvailableActionsUseCase

  beforeEach(() => {
    reset(mockActionService)
    instanceUnderTest = new ListAvailableActionsUseCase(
      instance(mockActionService),
    )
  })

  describe('execute', () => {
    it('lists available actions successfully', async () => {
      when(mockActionService.listAvailable(anything())).thenResolve({
        availableActions: [EntityDataFactory.availableAction],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.execute({
        dataHolderId: 'testDataHolderId',
      })

      expect(result).toStrictEqual({
        availableActions: [EntityDataFactory.availableAction],
        nextToken: 'nextToken',
      })
      const [inputArg] = capture(mockActionService.listAvailable).first()
      expect(inputArg).toStrictEqual({ dataHolderId: 'testDataHolderId' })
      verify(mockActionService.listAvailable(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockActionService.listAvailable(anything())).thenReject(
        new Error('service error'),
      )

      await expect(
        instanceUnderTest.execute({ dataHolderId: 'testDataHolderId' }),
      ).rejects.toThrow('service error')
    })
  })
})
