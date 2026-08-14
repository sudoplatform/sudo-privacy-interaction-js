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
import Observable from 'zen-observable'
import { DefaultAnalysisResultService } from '../../../../../src/private/data/analysis-result/defaultAnalysisResultService'
import { ApiClient } from '../../../../../src/private/data/common/apiClient'
import {
  AnalysisResultSubscriber,
  ConnectionState,
} from '../../../../../src/public'
import { EntityDataFactory } from '../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../data-factory/graphQL'

describe('DefaultAnalysisResultService Test Suite', () => {
  const mockAppSync = mock<ApiClient>()

  let instanceUnderTest: DefaultAnalysisResultService

  beforeEach(() => {
    reset(mockAppSync)
    instanceUnderTest = new DefaultAnalysisResultService(instance(mockAppSync))
  })

  describe('get', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.getAnalysisResult(anything())).thenResolve(
        GraphQLDataFactory.analysisResult,
      )

      const result = await instanceUnderTest.get('testId')

      expect(result).toStrictEqual(EntityDataFactory.analysisResult)
      const [idArg] = capture(mockAppSync.getAnalysisResult).first()
      expect(idArg).toBe('testId')
      verify(mockAppSync.getAnalysisResult(anything())).once()
    })

    it('returns undefined when appSync returns undefined', async () => {
      when(mockAppSync.getAnalysisResult(anything())).thenResolve(undefined)

      const result = await instanceUnderTest.get('nonExistentId')

      expect(result).toBeUndefined()
      verify(mockAppSync.getAnalysisResult(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.getAnalysisResult(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(instanceUnderTest.get('testId')).rejects.toThrow(
        'GraphQL error',
      )
      verify(mockAppSync.getAnalysisResult(anything())).once()
    })
  })

  describe('list', () => {
    it('calls appSync and returns results correctly', async () => {
      when(mockAppSync.listAnalysisResults(anything())).thenResolve({
        items: [GraphQLDataFactory.analysisResult],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.list({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 5,
        nextToken: 'inputNextToken',
      })

      expect(result).toStrictEqual({
        analysisResults: [EntityDataFactory.analysisResult],
        nextToken: 'nextToken',
      })
      const [inputArg] = capture(mockAppSync.listAnalysisResults).first()
      expect(inputArg).toStrictEqual({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 5,
        nextToken: 'inputNextToken',
      })
      verify(mockAppSync.listAnalysisResults(anything())).once()
    })

    it('returns empty list when appSync returns no items', async () => {
      when(mockAppSync.listAnalysisResults(anything())).thenResolve({
        items: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.list({
        virtualPresenceId: 'testVirtualPresenceId',
      })

      expect(result).toStrictEqual({
        analysisResults: [],
        nextToken: undefined,
      })
      verify(mockAppSync.listAnalysisResults(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.listAnalysisResults(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(
        instanceUnderTest.list({
          virtualPresenceId: 'testVirtualPresenceId',
        }),
      ).rejects.toThrow('GraphQL error')
      verify(mockAppSync.listAnalysisResults(anything())).once()
    })
  })

  describe('subscribe', () => {
    const mockSubscriber: AnalysisResultSubscriber = {
      analysisResultUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }

    it('calls appSync subscription and registers subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onAnalysisResultUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockSubscriber,
      })

      verify(mockAppSync.onAnalysisResultUpdated('testOwner')).once()
      expect(mockSubscriber.connectionStatusChanged).toHaveBeenCalledWith(
        ConnectionState.Connected,
      )
    })

    it('does not create a new watcher on second subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onAnalysisResultUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      const mockAnalysisResultSubscriber2: AnalysisResultSubscriber = {
        analysisResultUpdated: vi.fn(),
        connectionStatusChanged: vi.fn(),
      }

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockSubscriber,
      })
      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-2',
        owner: 'testOwner',
        subscriber: mockAnalysisResultSubscriber2,
      })

      verify(mockAppSync.onAnalysisResultUpdated(anything())).once()
    })

    it('throws when appSync subscription fails', async () => {
      when(mockAppSync.onAnalysisResultUpdated(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.subscribe({
          subscriptionId: 'sub-1',
          owner: 'testOwner',
          subscriber: mockSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })

  describe('unsubscribe', () => {
    const mockAnalysisResultSubscriber = mock<AnalysisResultSubscriber>()
    it('unsubscribes by subscription ID', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onAnalysisResultUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockAnalysisResultSubscriber,
      })

      instanceUnderTest.unsubscribe('sub-1')
    })
  })
})
