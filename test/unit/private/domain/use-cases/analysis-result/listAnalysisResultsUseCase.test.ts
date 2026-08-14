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
import { AnalysisResultService } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultService'
import { ListAnalysisResultsUseCase } from '../../../../../../src/private/domain/use-cases/analysis-result/listAnalysisResultsUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ListAnalysisResultsUseCase Test Suite', () => {
  const mockAnalysisResultService = mock<AnalysisResultService>()

  let instanceUnderTest: ListAnalysisResultsUseCase

  beforeEach(() => {
    reset(mockAnalysisResultService)
    instanceUnderTest = new ListAnalysisResultsUseCase(
      instance(mockAnalysisResultService),
    )
  })

  describe('execute', () => {
    it('lists analysis results successfully', async () => {
      when(mockAnalysisResultService.list(anything())).thenResolve({
        analysisResults: [EntityDataFactory.analysisResult],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.execute({
        virtualPresenceId: 'testVirtualPresenceId',
      })

      expect(result).toStrictEqual({
        analysisResults: [EntityDataFactory.analysisResult],
        nextToken: 'nextToken',
      })
      const [inputArgs] = capture(mockAnalysisResultService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: undefined,
        nextToken: undefined,
      })
      verify(mockAnalysisResultService.list(anything())).once()
    })

    it('lists analysis results with empty result', async () => {
      when(mockAnalysisResultService.list(anything())).thenResolve({
        analysisResults: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.execute({
        virtualPresenceId: 'testVirtualPresenceId',
      })

      expect(result).toStrictEqual({
        analysisResults: [],
        nextToken: undefined,
      })
      verify(mockAnalysisResultService.list(anything())).once()
    })

    it('passes limit and nextToken to the service correctly', async () => {
      when(mockAnalysisResultService.list(anything())).thenResolve({
        analysisResults: [EntityDataFactory.analysisResult],
        nextToken: 'resultNextToken',
      })

      const result = await instanceUnderTest.execute({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 10,
        nextToken: 'inputNextToken',
      })

      expect(result).toStrictEqual({
        analysisResults: [EntityDataFactory.analysisResult],
        nextToken: 'resultNextToken',
      })
      const [inputArgs] = capture(mockAnalysisResultService.list).first()
      expect(inputArgs).toStrictEqual<typeof inputArgs>({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 10,
        nextToken: 'inputNextToken',
      })
      verify(mockAnalysisResultService.list(anything())).once()
    })
  })
})
