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
import { ArchiveDataHolderUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/archiveDataHolderUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ArchiveDataHolderUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()

  let instanceUnderTest: ArchiveDataHolderUseCase

  beforeEach(() => {
    reset(mockDataHolderService)

    instanceUnderTest = new ArchiveDataHolderUseCase(
      instance(mockDataHolderService),
    )
  })

  describe('execute', () => {
    it('archives a data holder successfully', async () => {
      when(mockDataHolderService.archive(anything())).thenResolve(
        EntityDataFactory.dataHolder,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.dataHolder)
      const [idArg] = capture(mockDataHolderService.archive).first()
      expect(idArg).toBe('testId')
      verify(mockDataHolderService.archive(anything())).once()
    })

    it('throws when the service throws', async () => {
      when(mockDataHolderService.archive(anything())).thenReject(
        new Error('archive error'),
      )

      await expect(instanceUnderTest.execute('testId')).rejects.toThrow(
        'archive error',
      )
      verify(mockDataHolderService.archive(anything())).once()
    })
  })
})
