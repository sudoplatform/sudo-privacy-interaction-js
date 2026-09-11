/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import { v4 } from 'uuid'
import waitForExpect from 'wait-for-expect'
import {
  ConnectionState,
  DataHolder,
  DataHolderProtectionState,
  RelationshipProvider,
  SudoPrivacyInteractionClient,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'
import { resolveRelationshipProvider } from './util/relationshipProvider'

describe('Data Holder Integration Test Suite', () => {
  const log = new DefaultLogger('DataHolderIntegrationTest')

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient
  let relationshipProvider: RelationshipProvider

  const connectedIds = new Set<string>()

  beforeEach(async () => {
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient
    relationshipProvider = await resolveRelationshipProvider(instanceUnderTest)
  })

  afterEach(async () => {
    for (const id of connectedIds) {
      try {
        await instanceUnderTest.disconnectVirtualPresence(id)
      } catch (err) {
        log.debug('Cleanup disconnect failed (may already be disconnected)', {
          id,
          err,
        })
      }
    }
    connectedIds.clear()
    await userClient.reset()
  })

  describe('listDataHolders', () => {
    it('lists data holders for a connected virtual presence', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'dataholder-test@example.com',
          relationshipProvider,
        })
      expect(connectedVp).toBeDefined()
      connectedIds.add(connectedVp.id)

      const result = await instanceUnderTest.listDataHolders({
        virtualPresenceId: connectedVp.id,
      })

      expect(result).toBeDefined()
      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)

      for (const item of result.items) {
        expect(item.id).toBeDefined()
        expect(item.virtualPresenceId).toBe(connectedVp.id)
        expect(item.domainName).toBeDefined()
        expect(item.name).toBeDefined()
        expect(item.protectionState).toBeDefined()
        expect(Object.values(DataHolderProtectionState)).toContain(
          item.protectionState,
        )
        expect(item.mostRecentInteractionAt).toBeInstanceOf(Date)
        expect(item.owner).toBeDefined()
        expect(item.version).toBe(1)
        expect(item.createdAt).toBeInstanceOf(Date)
        expect(item.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('retrieves a list of data holders with pagination', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'dataholder-test@example.com',
          relationshipProvider,
        })
      expect(connectedVp).toBeDefined()
      connectedIds.add(connectedVp.id)

      const firstPage = await instanceUnderTest.listDataHolders({
        virtualPresenceId: connectedVp.id,
        limit: 1,
      })

      expect(firstPage).toBeDefined()

      if (firstPage.nextToken) {
        const secondPage = await instanceUnderTest.listDataHolders({
          virtualPresenceId: connectedVp.id,
          limit: 1,
          nextToken: firstPage.nextToken,
        })

        expect(secondPage).toBeDefined()
        expect(secondPage.items).toBeDefined()
      }
    })
  })

  describe('getDataHolder', () => {
    it('retrieves a single data holder successfully', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'dataholder-test@example.com',
          relationshipProvider,
        })
      expect(connectedVp).toBeDefined()
      connectedIds.add(connectedVp.id)

      const listResult = await instanceUnderTest.listDataHolders({
        virtualPresenceId: connectedVp.id,
      })
      if (listResult.items.length > 0) {
        const dataHolderId = listResult.items[0].id
        const dataHolder = await instanceUnderTest.getDataHolder(dataHolderId)

        expect(dataHolder).toBeDefined()
        expect(dataHolder?.id).toBe(dataHolderId)
        expect(dataHolder?.virtualPresenceId).toBe(connectedVp.id)
        expect(dataHolder?.domainName).toBeDefined()
        expect(dataHolder?.name).toBeDefined()
        expect(dataHolder?.protectionState).toBeDefined()
        expect(typeof dataHolder?.complianceConcern).toBe('boolean')
        expect(dataHolder?.mostRecentInteractionAt).toBeInstanceOf(Date)
        expect(dataHolder?.createdAt).toBeInstanceOf(Date)
        expect(dataHolder?.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('returns undefined for non-existent data holder', async () => {
      const result = await instanceUnderTest.getDataHolder(
        'non-existent-data-holder-id',
      )

      expect(result).toBeUndefined()
    })
  })

  describe('data holder subscriptions', () => {
    it('successfully subscribes and receives connected state', async () => {
      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected
      let connectionStateChangeCalled = false

      await instanceUnderTest.subscribeToDataHolders(subscriptionId, {
        dataHoldersUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionStateChangeCalled = true
          connectionState = state
        },
      })

      expect(connectionStateChangeCalled).toBeTruthy()
      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromDataHolders(subscriptionId)
    })

    it('does not notify after unsubscribing', async () => {
      const subscriptionId = v4()
      let updateCalled = false

      await instanceUnderTest.subscribeToDataHolders(subscriptionId, {
        dataHoldersUpdated(): void {
          updateCalled = true
        },
        connectionStatusChanged(): void {},
      })

      instanceUnderTest.unsubscribeFromDataHolders(subscriptionId)

      // Connect a VP to trigger scanning — data holder updates are emitted during discovery
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'dh-sub-test@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp.id)

      await waitForExpect(() => {
        expect(updateCalled).toBeFalsy()
      })
    })

    it('supports multiple subscribers without error', async () => {
      const subscriptionId1 = v4()
      const subscriptionId2 = v4()
      let subscriber1Connected = false
      let subscriber2Connected = false

      await instanceUnderTest.subscribeToDataHolders(subscriptionId1, {
        dataHoldersUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber1Connected = true
          }
        },
      })

      await instanceUnderTest.subscribeToDataHolders(subscriptionId2, {
        dataHoldersUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber2Connected = true
          }
        },
      })

      // First subscriber should have received Connected
      expect(subscriber1Connected).toBeTruthy()

      instanceUnderTest.unsubscribeFromDataHolders(subscriptionId1)
      instanceUnderTest.unsubscribeFromDataHolders(subscriptionId2)
    })
  })
})
