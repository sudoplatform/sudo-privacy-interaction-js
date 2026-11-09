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
import { ListActionsForDataHolderUseCase } from '../../../../../../src/private/domain/use-cases/action/listActionsForDataHolderUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ListActionsForDataHolderUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()

  let instanceUnderTest: ListActionsForDataHolderUseCase

  beforeEach(() => {
    reset(mockActionService)
    instanceUnderTest = new ListActionsForDataHolderUseCase(
      instance(mockActionService),
    )
  })

  describe('execute', () => {
    it('lists the action history successfully', async () => {
      when(mockActionService.listForDataHolder(anything())).thenResolve({
        actions: [EntityDataFactory.action],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.execute({
        dataHolderId: 'testDataHolderId',
      })

      expect(result).toStrictEqual({
        actions: [EntityDataFactory.action],
        nextToken: 'nextToken',
      })
      const [inputArg] = capture(mockActionService.listForDataHolder).first()
      expect(inputArg).toStrictEqual({ dataHolderId: 'testDataHolderId' })
      verify(mockActionService.listForDataHolder(anything())).once()
    })

    it('forwards limit and nextToken to the service', async () => {
      when(mockActionService.listForDataHolder(anything())).thenResolve({
        actions: [EntityDataFactory.action],
        nextToken: undefined,
      })

      await instanceUnderTest.execute({
        dataHolderId: 'testDataHolderId',
        limit: 10,
        nextToken: 'token',
      })

      const [inputArg] = capture(mockActionService.listForDataHolder).first()
      expect(inputArg).toStrictEqual({
        dataHolderId: 'testDataHolderId',
        limit: 10,
        nextToken: 'token',
      })
      verify(mockActionService.listForDataHolder(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockActionService.listForDataHolder(anything())).thenReject(
        new Error('service error'),
      )

      await expect(
        instanceUnderTest.execute({ dataHolderId: 'testDataHolderId' }),
      ).rejects.toThrow('service error')
    })
  })
})
