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
import { ListDataHolderScanSummariesUseCase } from '../../../../../../src/private/domain/use-cases/data-holder/listDataHolderScanSummariesUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ListDataHolderScanSummariesUseCase Test Suite', () => {
  const mockDataHolderService = mock<DataHolderService>()

  let instanceUnderTest: ListDataHolderScanSummariesUseCase

  beforeEach(() => {
    reset(mockDataHolderService)
    instanceUnderTest = new ListDataHolderScanSummariesUseCase(
      instance(mockDataHolderService),
    )
  })

  describe('execute', () => {
    it('lists scan summaries successfully', async () => {
      when(mockDataHolderService.listScanSummaries(anything())).thenResolve({
        scanSummaries: [EntityDataFactory.dataHolderScanSummary],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.execute({
        dataHolderId: 'testId',
      })

      expect(result).toStrictEqual({
        scanSummaries: [EntityDataFactory.dataHolderScanSummary],
        nextToken: 'nextToken',
      })
      const [inputArgs] = capture(
        mockDataHolderService.listScanSummaries,
      ).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        dataHolderId: 'testId',
        limit: undefined,
        nextToken: undefined,
      })
      verify(mockDataHolderService.listScanSummaries(anything())).once()
    })

    it('lists scan summaries successfully with empty result items', async () => {
      when(mockDataHolderService.listScanSummaries(anything())).thenResolve({
        scanSummaries: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.execute({
        dataHolderId: 'testId',
      })

      expect(result).toStrictEqual({
        scanSummaries: [],
        nextToken: undefined,
      })
      verify(mockDataHolderService.listScanSummaries(anything())).once()
    })

    it('passes limit and nextToken to the service correctly', async () => {
      when(mockDataHolderService.listScanSummaries(anything())).thenResolve({
        scanSummaries: [EntityDataFactory.dataHolderScanSummary],
        nextToken: 'resultNextToken',
      })

      const result = await instanceUnderTest.execute({
        dataHolderId: 'testId',
        limit: 10,
        nextToken: 'inputNextToken',
      })

      expect(result).toStrictEqual({
        scanSummaries: [EntityDataFactory.dataHolderScanSummary],
        nextToken: 'resultNextToken',
      })
      const [inputArgs] = capture(
        mockDataHolderService.listScanSummaries,
      ).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        dataHolderId: 'testId',
        limit: 10,
        nextToken: 'inputNextToken',
      })
      verify(mockDataHolderService.listScanSummaries(anything())).once()
    })
  })
})
