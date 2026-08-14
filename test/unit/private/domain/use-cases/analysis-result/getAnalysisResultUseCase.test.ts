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
import { GetAnalysisResultUseCase } from '../../../../../../src/private/domain/use-cases/analysis-result/getAnalysisResultUseCase'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('GetAnalysisResultUseCase Test Suite', () => {
  const mockAnalysisResultService = mock<AnalysisResultService>()

  let instanceUnderTest: GetAnalysisResultUseCase

  beforeEach(() => {
    reset(mockAnalysisResultService)

    instanceUnderTest = new GetAnalysisResultUseCase(
      instance(mockAnalysisResultService),
    )
  })

  describe('execute', () => {
    it('retrieves an analysis result successfully', async () => {
      when(mockAnalysisResultService.get(anything())).thenResolve(
        EntityDataFactory.analysisResult,
      )

      const result = await instanceUnderTest.execute('testId')

      expect(result).toStrictEqual(EntityDataFactory.analysisResult)
      const [idArg] = capture(mockAnalysisResultService.get).first()
      expect(idArg).toBe('testId')
      verify(mockAnalysisResultService.get(anything())).once()
    })

    it('returns undefined when analysis result not found', async () => {
      when(mockAnalysisResultService.get(anything())).thenResolve(undefined)

      const result = await instanceUnderTest.execute('nonExistentId')

      expect(result).toBeUndefined()
      verify(mockAnalysisResultService.get(anything())).once()
    })
  })
})
