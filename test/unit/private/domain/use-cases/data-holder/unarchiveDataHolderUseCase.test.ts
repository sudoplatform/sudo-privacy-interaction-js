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
import { UnarchiveDataHolderUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/unarchiveDataHolderUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('UnarchiveDataHolderUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()

  let instanceUnderTest: UnarchiveDataHolderUseCase

  beforeEach(() => {
    reset(mockDataHolderService)

    instanceUnderTest = new UnarchiveDataHolderUseCase(
      instance(mockDataHolderService),
    )
  })

  describe('execute', () => {
    it('unarchives a data holder successfully', async () => {
      when(mockDataHolderService.unarchive(anything())).thenResolve(
        EntityDataFactory.dataHolder,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.dataHolder)
      const [idArg] = capture(mockDataHolderService.unarchive).first()
      expect(idArg).toBe('testId')
      verify(mockDataHolderService.unarchive(anything())).once()
    })

    it('throws when the service throws', async () => {
      when(mockDataHolderService.unarchive(anything())).thenReject(
        new Error('unarchive error'),
      )

      await expect(instanceUnderTest.execute('testId')).rejects.toThrow(
        'unarchive error',
      )
      verify(mockDataHolderService.unarchive(anything())).once()
    })
  })
})
