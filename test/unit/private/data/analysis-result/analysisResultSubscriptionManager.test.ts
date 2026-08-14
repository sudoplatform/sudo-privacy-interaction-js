/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnAnalysisResultUpdateSubscription } from '../../../../../src/gen/graphqlTypes'
import { AnalysisResultSubscriptionManager } from '../../../../../src/private/data/analysis-result/analysisResultSubscriptionManager'
import {
  AnalysisResultStatus,
  AnalysisResultUpdate,
} from '../../../../../src/public/typings/analysisResult'
import {
  AnalysisResultSubscriber,
  ConnectionState,
} from '../../../../../src/public/typings/subscription'

describe('AnalysisResultSubscriptionManager Test Suite', () => {
  let instanceUnderTest: AnalysisResultSubscriptionManager<
    OnAnalysisResultUpdateSubscription,
    AnalysisResultSubscriber
  >

  const mockUpdate: AnalysisResultUpdate = {
    id: 'testId',
    virtualPresenceId: 'testVpId',
    dataHolderIdentifier: 'example.com',
    status: AnalysisResultStatus.Complete,
    lastAnalyzedAt: new Date(4.0),
    owner: 'testOwner',
    version: 1,
    createdAt: new Date(1.0),
    updatedAt: new Date(2.0),
  }

  const createMockSubscriber = (): AnalysisResultSubscriber => ({
    analysisResultUpdated: vi.fn(),
    connectionStatusChanged: vi.fn(),
  })

  beforeEach(() => {
    instanceUnderTest = new AnalysisResultSubscriptionManager<
      OnAnalysisResultUpdateSubscription,
      AnalysisResultSubscriber
    >()
  })

  describe('subscribe', () => {
    it('registers a subscriber', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)

      instanceUnderTest.analysisResultUpdated(mockUpdate)

      expect(subscriber.analysisResultUpdated).toHaveBeenCalledWith(mockUpdate)
    })

    it('registers multiple subscribers', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)

      instanceUnderTest.analysisResultUpdated(mockUpdate)

      expect(subscriber1.analysisResultUpdated).toHaveBeenCalledTimes(1)
      expect(subscriber2.analysisResultUpdated).toHaveBeenCalledTimes(1)
    })
  })

  describe('unsubscribe', () => {
    it('removes a subscriber so it no longer receives updates', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)
      instanceUnderTest.unsubscribe('sub-1')

      instanceUnderTest.analysisResultUpdated(mockUpdate)

      expect(subscriber.analysisResultUpdated).not.toHaveBeenCalled()
    })

    it('resets watcher when last subscriber unsubscribes', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)

      const mockWatcher = {} as any
      instanceUnderTest.setWatcher(mockWatcher)
      const mockSubscription = { unsubscribe: vi.fn(), closed: false }
      instanceUnderTest.setSubscription(
        mockSubscription as unknown as ZenObservable.Subscription,
      )

      instanceUnderTest.unsubscribe('sub-1')

      expect(instanceUnderTest.getWatcher()).toBeNull()
      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1)
    })

    it('does not reset watcher when other subscribers remain', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)

      const mockWatcher = {} as any
      instanceUnderTest.setWatcher(mockWatcher)
      const mockSubscription = { unsubscribe: vi.fn(), closed: false }
      instanceUnderTest.setSubscription(
        mockSubscription as unknown as ZenObservable.Subscription,
      )

      instanceUnderTest.unsubscribe('sub-1')

      expect(instanceUnderTest.getWatcher()).not.toBeNull()
      expect(mockSubscription.unsubscribe).not.toHaveBeenCalled()
    })
  })

  describe('connectionStatusChanged', () => {
    it('notifies all subscribers of connection state change', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)

      instanceUnderTest.connectionStatusChanged(ConnectionState.Connected)

      expect(subscriber1.connectionStatusChanged).toHaveBeenCalledWith(
        ConnectionState.Connected,
      )
      expect(subscriber2.connectionStatusChanged).toHaveBeenCalledWith(
        ConnectionState.Connected,
      )
    })

    it('resets state on disconnect', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)

      const mockSubscription = { unsubscribe: vi.fn(), closed: false }
      instanceUnderTest.setSubscription(
        mockSubscription as unknown as ZenObservable.Subscription,
      )

      instanceUnderTest.connectionStatusChanged(ConnectionState.Disconnected)

      expect(subscriber.connectionStatusChanged).toHaveBeenCalledWith(
        ConnectionState.Disconnected,
      )
      expect(instanceUnderTest.getWatcher()).toBeNull()
      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1)
    })
  })

  describe('analysisResultUpdated', () => {
    it('notifies all subscribers', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)

      instanceUnderTest.analysisResultUpdated(mockUpdate)

      expect(subscriber1.analysisResultUpdated).toHaveBeenCalledWith(mockUpdate)
      expect(subscriber2.analysisResultUpdated).toHaveBeenCalledWith(mockUpdate)
    })

    it('does not notify unsubscribed subscribers', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)
      instanceUnderTest.unsubscribe('sub-1')

      instanceUnderTest.analysisResultUpdated(mockUpdate)

      expect(subscriber1.analysisResultUpdated).not.toHaveBeenCalled()
      expect(subscriber2.analysisResultUpdated).toHaveBeenCalledTimes(1)
    })
  })

  describe('setWatcher / getWatcher', () => {
    it('stores and retrieves watcher', () => {
      expect(instanceUnderTest.getWatcher()).toBeNull()

      const mockWatcher = {} as any
      instanceUnderTest.setWatcher(mockWatcher)

      expect(instanceUnderTest.getWatcher()).toBe(mockWatcher)
    })
  })

  describe('setSubscription', () => {
    it('returns the subscription manager for chaining', () => {
      const result = instanceUnderTest.setSubscription(undefined)

      expect(result).toBe(instanceUnderTest)
    })
  })
})
