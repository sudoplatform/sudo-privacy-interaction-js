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
import {
  ActionFulfilmentMethodEntity,
  ActionIntentEntity,
} from '../../../../../../src/private/domain/entities/action/actionEntity'
import { ActionService } from '../../../../../../src/private/domain/entities/action/actionService'
import { InitiateActionUseCase } from '../../../../../../src/private/domain/use-cases/action/initiateActionUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('InitiateActionUseCase Test Suite', () => {
  const mockActionService = mock<ActionService>()

  let instanceUnderTest: InitiateActionUseCase

  beforeEach(() => {
    reset(mockActionService)
    instanceUnderTest = new InitiateActionUseCase(instance(mockActionService))
  })

  describe('execute', () => {
    it('initiates an action successfully', async () => {
      when(mockActionService.initiate(anything())).thenResolve(
        EntityDataFactory.action,
      )

      const input = {
        dataHolderId: 'testDataHolderId',
        intent: ActionIntentEntity.StopContact,
        fulfilmentMethod: ActionFulfilmentMethodEntity.Assisted,
      }
      const result = await instanceUnderTest.execute(input)

      expect(result).toStrictEqual(EntityDataFactory.action)
      const [inputArg] = capture(mockActionService.initiate).first()
      expect(inputArg).toStrictEqual(input)
      verify(mockActionService.initiate(anything())).once()
    })

    it('throws when service throws', async () => {
      when(mockActionService.initiate(anything())).thenReject(
        new Error('service error'),
      )

      await expect(
        instanceUnderTest.execute({
          dataHolderId: 'testDataHolderId',
          intent: ActionIntentEntity.StopContact,
          fulfilmentMethod: ActionFulfilmentMethodEntity.Assisted,
        }),
      ).rejects.toThrow('service error')
    })
  })
})
