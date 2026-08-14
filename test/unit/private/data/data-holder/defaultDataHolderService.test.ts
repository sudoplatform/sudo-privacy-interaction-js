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
import { ApiClient } from '../../../../../src/private/data/common/apiClient'
import { DefaultDataHolderService } from '../../../../../src/private/data/data-holder/defaultDataHolderService'
import {
  ConnectionState,
  DataHolderSubscriber,
} from '../../../../../src/public'
import { EntityDataFactory } from '../../../../data-factory/entity'
import { GraphQLDataFactory } from '../../../../data-factory/graphQL'

describe('DefaultDataHolderService Test Suite', () => {
  const mockAppSync = mock<ApiClient>()

  let instanceUnderTest: DefaultDataHolderService

  beforeEach(() => {
    reset(mockAppSync)
    instanceUnderTest = new DefaultDataHolderService(instance(mockAppSync))
  })

  describe('get', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.getDataHolder(anything())).thenResolve(
        GraphQLDataFactory.dataHolder,
      )

      const result = await instanceUnderTest.get('testId')

      expect(result).toStrictEqual(EntityDataFactory.dataHolder)
      const [idArg] = capture(mockAppSync.getDataHolder).first()
      expect(idArg).toBe('testId')
      verify(mockAppSync.getDataHolder(anything())).once()
    })

    it('calls appsync correctly with undefined result', async () => {
      when(mockAppSync.getDataHolder(anything())).thenResolve(undefined)

      const result = await instanceUnderTest.get('nonExistentId')

      expect(result).toBeUndefined()
      verify(mockAppSync.getDataHolder(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.getDataHolder(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(instanceUnderTest.get('testId')).rejects.toThrow(
        'GraphQL error',
      )
      verify(mockAppSync.getDataHolder(anything())).once()
    })
  })

  describe('list', () => {
    it('calls appSync and returns result correctly', async () => {
      when(mockAppSync.listDataHolders(anything())).thenResolve({
        items: [GraphQLDataFactory.dataHolder],
        nextToken: 'nextToken',
      })

      const result = await instanceUnderTest.list({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 1,
        nextToken: 'inputNextToken',
      })

      expect(result).toStrictEqual({
        dataHolders: [EntityDataFactory.dataHolder],
        nextToken: 'nextToken',
      })
      const [inputArg] = capture(mockAppSync.listDataHolders).first()
      expect(inputArg).toStrictEqual({
        virtualPresenceId: 'testVirtualPresenceId',
        limit: 1,
        nextToken: 'inputNextToken',
      })
      verify(mockAppSync.listDataHolders(anything())).once()
    })

    it('returns empty list when appSync returns no items', async () => {
      when(mockAppSync.listDataHolders(anything())).thenResolve({
        items: [],
        nextToken: undefined,
      })

      const result = await instanceUnderTest.list({
        virtualPresenceId: 'testVirtualPresenceId',
      })

      expect(result).toStrictEqual({
        dataHolders: [],
        nextToken: undefined,
      })
      verify(mockAppSync.listDataHolders(anything())).once()
    })

    it('throws error when appSync throws', async () => {
      when(mockAppSync.listDataHolders(anything())).thenReject(
        new Error('GraphQL error'),
      )

      await expect(
        instanceUnderTest.list({
          virtualPresenceId: 'testVirtualPresenceId',
        }),
      ).rejects.toThrow('GraphQL error')
      verify(mockAppSync.listDataHolders(anything())).once()
    })
  })

  describe('subscribe', () => {
    const mockDataHolderSubscriber: DataHolderSubscriber = {
      dataHoldersUpdated: vi.fn(),
      connectionStatusChanged: vi.fn(),
    }

    it('calls appsync subscription and registers subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onDataHoldersUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockDataHolderSubscriber,
      })

      verify(mockAppSync.onDataHoldersUpdated('testOwner')).once()
      expect(
        mockDataHolderSubscriber.connectionStatusChanged,
      ).toHaveBeenCalledWith(ConnectionState.Connected)
    })

    it('does not create a new watcher on second subscriber', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onDataHoldersUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      const mockDataHolderSubscriber2 = mock<DataHolderSubscriber>()

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockDataHolderSubscriber,
      })
      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-2',
        owner: 'testOwner',
        subscriber: mockDataHolderSubscriber2,
      })

      verify(mockAppSync.onDataHoldersUpdated(anything())).once()
    })

    it('throws error when appSync subscription fails', async () => {
      when(mockAppSync.onDataHoldersUpdated(anything())).thenReject(
        new Error('subscription failed'),
      )

      await expect(
        instanceUnderTest.subscribe({
          subscriptionId: 'sub-1',
          owner: 'testOwner',
          subscriber: mockDataHolderSubscriber,
        }),
      ).rejects.toThrow('subscription failed')
    })
  })

  describe('unsubscribe', () => {
    const mockDataHolderSubscriber = mock<DataHolderSubscriber>()

    it('unsubscribes by subscription ID', async () => {
      const mockObservable = new Observable(() => {})
      when(mockAppSync.onDataHoldersUpdated(anything())).thenResolve(
        mockObservable as any,
      )

      await instanceUnderTest.subscribe({
        subscriptionId: 'sub-1',
        owner: 'testOwner',
        subscriber: mockDataHolderSubscriber,
      })

      instanceUnderTest.unsubscribe('sub-1')
    })
  })
})
