/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotSignedInError } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { anything, instance, mock, reset, verify, when } from 'ts-mockito'
import { AnalysisResultService } from '../../../../../../src/private/domain/entities/analysis-result/analysisResultService'
import { SubscribeToAnalysisResultUseCase } from '../../../../../../src/private/domain/use-cases/analysis-result/subscribeToAnalysisResultUseCase'
import { AnalysisResultSubscriber } from '../../../../../../src/public/typings/subscription'

describe('SubscribeToAnalysisResultUseCase Test Suite', () => {
  const mockAnalysisResultService = mock<AnalysisResultService>()
  const mockUserClient = mock<SudoUserClient>()

  let instanceUnderTest: SubscribeToAnalysisResultUseCase

  const mockSubscriber: AnalysisResultSubscriber = {
    analysisResultUpdated: vi.fn(),
    connectionStatusChanged: vi.fn(),
  }

  beforeEach(() => {
    reset(mockAnalysisResultService)
    reset(mockUserClient)

    instanceUnderTest = new SubscribeToAnalysisResultUseCase(
      instance(mockAnalysisResultService),
      instance(mockUserClient),
    )
  })

  describe('execute', () => {
    it('subscribes to analysis result updates successfully', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockAnalysisResultService.subscribe(anything())).thenResolve()

      await instanceUnderTest.execute({
        subscriptionId: 'sub-1',
        subscriber: mockSubscriber,
      })

      verify(mockAnalysisResultService.subscribe(anything())).once()
    })

    it('throws NotSignedInError when user is not signed in', async () => {
      when(mockUserClient.getSubject()).thenResolve(undefined)

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockSubscriber,
        }),
      ).rejects.toThrow(NotSignedInError)

      verify(mockAnalysisResultService.subscribe(anything())).never()
    })

    it('throws when service throws', async () => {
      when(mockUserClient.getSubject()).thenResolve('testOwner')
      when(mockAnalysisResultService.subscribe(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.execute({
          subscriptionId: 'sub-1',
          subscriber: mockSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })
})
