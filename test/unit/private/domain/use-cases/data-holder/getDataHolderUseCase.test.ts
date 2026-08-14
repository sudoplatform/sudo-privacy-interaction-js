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
import { DataHolderService } from '../../../../../../src/private/domain/entities/data-holder/dataHolderService'
import { GetDataHolderUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/getDataHolderUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('GetDataHolderUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()

  let instanceUnderTest: GetDataHolderUseCase

  beforeEach(() => {
    reset(mockDataHolderService)

    instanceUnderTest = new GetDataHolderUseCase(
      instance(mockDataHolderService),
    )
  })

  describe('execute', () => {
    it('retrieves a data holder successfully', async () => {
      when(mockDataHolderService.get(anything())).thenResolve(
        EntityDataFactory.dataHolder,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.dataHolder)
      const [idArg] = capture(mockDataHolderService.get).first()
      expect(idArg).toBe('testId')
      verify(mockDataHolderService.get(anything())).once()
    })

    it('returns undefined when data holder not found', async () => {
      when(mockDataHolderService.get(anything())).thenResolve(undefined)

      const result = await instanceUnderTest.execute('nonExistentId')

      expect(result).toBeUndefined()
      verify(mockDataHolderService.get(anything())).once()
    })
  })
})
