/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OnDataHoldersUpdateSubscription } from '../../../../../src/gen/graphqlTypes'
import { DataHolderSubscriptionManager } from '../../../../../src/private/data/data-holder/dataHolderSubscriptionManager'
import {
  ConnectionState,
  DataHolderSubscriber,
} from '../../../../../src/public'
import { APIDataFactory } from '../../../../data-factory/api'

describe('DataHolderSubscriptionManager Test Suite', () => {
  let instanceUnderTest: DataHolderSubscriptionManager<
    OnDataHoldersUpdateSubscription,
    DataHolderSubscriber
  >

  const createMockSubscriber = (): DataHolderSubscriber => ({
    dataHoldersUpdated: vi.fn(),
    connectionStatusChanged: vi.fn(),
  })

  beforeEach(() => {
    instanceUnderTest = new DataHolderSubscriptionManager<
      OnDataHoldersUpdateSubscription,
      DataHolderSubscriber
    >()
  })

  describe('subscribe', () => {
    it('registers a subscriber', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)

      instanceUnderTest.dataHoldersUpdated([APIDataFactory.dataHolder])

      expect(subscriber.dataHoldersUpdated).toHaveBeenCalledWith([
        APIDataFactory.dataHolder,
      ])
    })

    it('registers multiple subscribers', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)

      instanceUnderTest.dataHoldersUpdated([APIDataFactory.dataHolder])

      expect(subscriber1.dataHoldersUpdated).toHaveBeenCalledTimes(1)
      expect(subscriber2.dataHoldersUpdated).toHaveBeenCalledTimes(1)
    })
  })

  describe('unsubscribe', () => {
    it('removes a subscriber so it no longer receives updates', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)
      instanceUnderTest.unsubscribe('sub-1')

      instanceUnderTest.dataHoldersUpdated([APIDataFactory.dataHolder])

      expect(subscriber.dataHoldersUpdated).not.toHaveBeenCalled()
    })

    it('resets watcher when last subscriber unsubscribes', () => {
      const subscriber = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber)

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

  describe('dataHoldersUpdated', () => {
    it('notifies all subscribers of data holder updates', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)

      instanceUnderTest.dataHoldersUpdated([APIDataFactory.dataHolder])

      expect(subscriber1.dataHoldersUpdated).toHaveBeenCalledWith([
        APIDataFactory.dataHolder,
      ])
      expect(subscriber2.dataHoldersUpdated).toHaveBeenCalledWith([
        APIDataFactory.dataHolder,
      ])
    })

    it('does not notify unsubscribed subscribers', () => {
      const subscriber1 = createMockSubscriber()
      const subscriber2 = createMockSubscriber()
      instanceUnderTest.subscribe('sub-1', subscriber1)
      instanceUnderTest.subscribe('sub-2', subscriber2)
      instanceUnderTest.unsubscribe('sub-1')

      instanceUnderTest.dataHoldersUpdated([APIDataFactory.dataHolder])

      expect(subscriber1.dataHoldersUpdated).not.toHaveBeenCalled()
      expect(subscriber2.dataHoldersUpdated).toHaveBeenCalledTimes(1)
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
