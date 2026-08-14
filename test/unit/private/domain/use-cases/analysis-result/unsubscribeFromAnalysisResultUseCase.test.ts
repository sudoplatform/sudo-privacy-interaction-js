/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { instance, mock, reset, verify } from 'ts-mockito'
import { AnalysisResultService } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultService'
import { UnsubscribeFromAnalysisResultUseCase } from '../../../../../../src/private/domain/use-cases/analysis-result/unsubscribeFromAnalysisResultUseCase'

describe('UnsubscribeFromAnalysisResultUseCase Test Suite', () => {
  const mockAnalysisResultService = mock<AnalysisResultService>()

  let instanceUnderTest: UnsubscribeFromAnalysisResultUseCase

  beforeEach(() => {
    reset(mockAnalysisResultService)

    instanceUnderTest = new UnsubscribeFromAnalysisResultUseCase(
      instance(mockAnalysisResultService),
    )
  })

  describe('execute', () => {
    it('unsubscribes from analysis result updates successfully', () => {
      instanceUnderTest.execute('sub-1')

      verify(mockAnalysisResultService.unsubscribe('sub-1')).once()
    })
  })
})
