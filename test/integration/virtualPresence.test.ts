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
  RelationshipProvider,
  SudoPrivacyInteractionClient,
  VirtualPresenceState,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'
import { resolveRelationshipProvider } from './util/relationshipProvider'

describe('Virtual Presence Integration Test Suite', () => {
  const log = new DefaultLogger('VirtualPresenceIntegrationTest')

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

  describe('virtual presence lifecycle', () => {
    it('connects, retrieves and disconnects a virtual presence succcesfully', async () => {
      // Connect a virtual presence
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'integration-test@example.com',
          relationshipProvider,
        })
      expect(connectedVp).toBeDefined()
      expect(connectedVp.id).toBeDefined()
      expect(typeof connectedVp.id).toBe('string')
      expect(connectedVp.owner).toBeDefined()
      expect(connectedVp.identifier).toBe('integration-test@example.com')
      expect(connectedVp.state).toBeDefined()
      expect(connectedVp.providerType).toBeDefined()
      expect(connectedVp.version).toBeGreaterThanOrEqual(1)
      expect(connectedVp.createdAt).toBeInstanceOf(Date)
      expect(connectedVp.updatedAt).toBeInstanceOf(Date)
      expect(connectedVp.lastScannedAt).toBeInstanceOf(Date)

      // List the single connected virtual presence
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listVirtualPresences({})
          const vp = result.items.find((item) => item.id === connectedVp.id)
          expect(vp).toBeDefined()
          expect(vp?.identifier).toBe('integration-test@example.com')
          expect(vp?.state).toBe(VirtualPresenceState.Connected)
        },
        60000,
        3000,
      )

      // Disconnect the virtual presence
      const disconnectedVp = await instanceUnderTest.disconnectVirtualPresence(
        connectedVp.id,
      )
      expect(disconnectedVp).toBeDefined()
      expect(disconnectedVp.id).toBe(connectedVp.id)
      expect(disconnectedVp.identifier).toBe('integration-test@example.com')
      expect(disconnectedVp.state).toBe(VirtualPresenceState.Inactive)
    })

    it('retrieves a list of virtual presences respecting limit successfully', async () => {
      const connectedVp1 =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token1',
          providerIdentity: 'integration-test1@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp1.id)
      expect(connectedVp1).toBeDefined()

      const connectedVp2 =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token2',
          providerIdentity: 'integration-test2@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp2.id)
      expect(connectedVp2).toBeDefined()

      const result = await instanceUnderTest.listVirtualPresences({ limit: 1 })
      expect(result.items).toHaveLength(1)
      expect(result.nextToken).toBeTruthy()
    })

    it('retrieves a list of virtual presences with pagination', async () => {
      // Perform an initial list first
      let result = await instanceUnderTest.listVirtualPresences({})
      expect(result.items).toHaveLength(0)

      const connectedVp1 =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token1',
          providerIdentity: 'integration-test1@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp1.id)
      expect(connectedVp1).toBeDefined()

      result = await instanceUnderTest.listVirtualPresences({})
      expect(result.items).toHaveLength(1)
      const foundVp1 = result.items.find((item) => item.id === connectedVp1.id)
      expect(foundVp1).toBeDefined()
      expect(foundVp1?.identifier).toBe('integration-test1@example.com')
      expect(result.nextToken).toBeFalsy()

      // Connect a second virtual presence and perform a list again
      const connectedVp2 =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token2',
          providerIdentity: 'integration-test2@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp2.id)
      expect(connectedVp2).toBeDefined()
      result = await instanceUnderTest.listVirtualPresences({})
      expect(result.items).toHaveLength(2)
    })
  })

  describe('rescanVirtualPresence', () => {
    it('rescans a connected virtual presence successfully', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'rescan-test@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp.id)
      expect(connectedVp).toBeDefined()

      const rescannedVp = await instanceUnderTest.rescanVirtualPresence({
        id: connectedVp.id,
      })

      expect(rescannedVp).toBeDefined()
      expect(rescannedVp.id).toBe(connectedVp.id)
      expect(rescannedVp.identifier).toBe('rescan-test@example.com')
      expect(rescannedVp.owner).toBe(connectedVp.owner)
      expect(rescannedVp.version).toBeGreaterThanOrEqual(connectedVp.version)
      expect(rescannedVp.createdAt).toBeInstanceOf(Date)
      expect(rescannedVp.updatedAt).toBeInstanceOf(Date)
    })

    it('rescans a virtual presence with scan options', async () => {
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'rescan-options-test@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp.id)
      expect(connectedVp).toBeDefined()

      const rescannedVp = await instanceUnderTest.rescanVirtualPresence({
        id: connectedVp.id,
        options: {
          maximumItemsProcessed: 50,
          earliestScanDate: '2025-01-01',
          latestScanDate: '2026-06-01',
          excludeDomains: ['spam.com'],
          excludeCategories: ['newsletters'],
        },
      })

      expect(rescannedVp).toBeDefined()
      expect(rescannedVp.id).toBe(connectedVp.id)
      expect(rescannedVp.identifier).toBe('rescan-options-test@example.com')
      expect(rescannedVp.version).toBeGreaterThanOrEqual(connectedVp.version)
      expect(rescannedVp.createdAt).toBeInstanceOf(Date)
      expect(rescannedVp.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('virtual presence subscriptions', () => {
    it('successfully subscribes and receives connected state', async () => {
      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected
      let connectionStateChangeCalled = false

      await instanceUnderTest.subscribeToVirtualPresence(subscriptionId, {
        virtualPresenceUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionStateChangeCalled = true
          connectionState = state
        },
      })

      expect(connectionStateChangeCalled).toBeTruthy()
      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromVirtualPresence(subscriptionId)
    })

    it('does not notify after unsubscribing', async () => {
      const subscriptionId = v4()
      let updateSubscriptionCalled = false

      await instanceUnderTest.subscribeToVirtualPresence(subscriptionId, {
        virtualPresenceUpdated(): void {
          updateSubscriptionCalled = true
        },
        connectionStatusChanged(): void {},
      })

      instanceUnderTest.unsubscribeFromVirtualPresence(subscriptionId)

      // Perform actions — no subscription events should arrive since
      // onVirtualPresenceUpdate only fires on NeedsReauth transitions
      // during discovery, but even if they did, we're unsubscribed
      const connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'test-refresh-token',
          providerIdentity: 'no-notify-test@example.com',
          relationshipProvider,
        })
      connectedIds.add(connectedVp.id)

      await waitForExpect(() => {
        expect(updateSubscriptionCalled).toBeFalsy()
      })
    })

    it('supports multiple subscribers without error', async () => {
      const subscriptionId1 = v4()
      const subscriptionId2 = v4()
      let subscriber1Connected = false
      let subscriber2Connected = false

      await instanceUnderTest.subscribeToVirtualPresence(subscriptionId1, {
        virtualPresenceUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber1Connected = true
          }
        },
      })

      await instanceUnderTest.subscribeToVirtualPresence(subscriptionId2, {
        virtualPresenceUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          if (state === ConnectionState.Connected) {
            subscriber2Connected = true
          }
        },
      })

      // First subscriber should have received Connected
      expect(subscriber1Connected).toBeTruthy()

      instanceUnderTest.unsubscribeFromVirtualPresence(subscriptionId1)
      instanceUnderTest.unsubscribeFromVirtualPresence(subscriptionId2)
    })
  })
})
