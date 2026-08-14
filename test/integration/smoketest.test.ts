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
  SudoPrivacyInteractionClient,
  VirtualPresence,
  VirtualPresenceState,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'

/**
 * These tests are designed to give us confidence that the built SudoPrivacyInteractionClient is functional
 * without running a full suite of tests. We test connecting and disconnecting virtual presences,
 * listing data holders and analysis results, rescanning, and subscription connectivity.
 */
describe('SudoPrivacyInteractionClient Smoketest Test Suite', () => {
  const log = new DefaultLogger('SudoPrivacyInteractionClientSmokeTests')

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient

  let connectedVp: VirtualPresence

  beforeAll(async () => {
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient

    // Connect a virtual presence to use throughout the smoketest suite
    connectedVp =
      await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
        refreshToken: 'smoketest-refresh-token',
        providerIdentity: 'smoketest@example.com',
      })

    log.info('Smoketest setup complete', {
      virtualPresenceId: connectedVp.id,
      identifier: connectedVp.identifier,
    })
  })

  afterAll(async () => {
    try {
      await instanceUnderTest.disconnectVirtualPresence(connectedVp.id)
    } catch (err) {
      log.debug('Cleanup disconnect failed (may already be disconnected)', {
        err,
      })
    }
    await userClient.reset()
  })

  describe('Virtual Presence Tests', () => {
    it('should have connected a virtual presence successfully', () => {
      expect(connectedVp).toBeDefined()
      expect(connectedVp.id).toBeDefined()
      expect(typeof connectedVp.id).toBe('string')
      expect(connectedVp.owner).toBeDefined()
      expect(connectedVp.identifier).toBe('smoketest@example.com')
      expect(connectedVp.state).toBeDefined()
      expect(connectedVp.providerType).toBeDefined()
      expect(connectedVp.version).toBeGreaterThanOrEqual(1)
      expect(connectedVp.createdAt).toBeInstanceOf(Date)
      expect(connectedVp.updatedAt).toBeInstanceOf(Date)
      expect(connectedVp.lastScannedAt).toBeInstanceOf(Date)
    })

    it('should list virtual presences', async () => {
      const result = await instanceUnderTest.listVirtualPresences({})
      expect(result.items.length).toBeGreaterThanOrEqual(1)

      const foundVp = result.items.find((item) => item.id === connectedVp.id)
      expect(foundVp).toBeDefined()
      expect(foundVp?.identifier).toBe('smoketest@example.com')
    })

    it('should rescan a virtual presence with options', async () => {
      const rescannedVp = await instanceUnderTest.rescanVirtualPresence({
        id: connectedVp.id,
        options: {
          maximumItemsProcessed: 10,
          earliestScanDate: '2025-01-01',
          excludeDomains: ['spam.com'],
        },
      })

      expect(rescannedVp).toBeDefined()
      expect(rescannedVp.id).toBe(connectedVp.id)
      expect(rescannedVp.version).toBeGreaterThanOrEqual(connectedVp.version)
    })

    it('should disconnect a virtual presence and reconnect', async () => {
      const disconnectedVp = await instanceUnderTest.disconnectVirtualPresence(
        connectedVp.id,
      )
      expect(disconnectedVp).toBeDefined()
      expect(disconnectedVp.id).toBe(connectedVp.id)
      expect(disconnectedVp.state).toBe(VirtualPresenceState.Inactive)

      connectedVp =
        await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
          refreshToken: 'smoketest-refresh-token',
          providerIdentity: 'smoketest@example.com',
        })

      // Wait for virtual presence to finish scanning and settle back to Connected
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listVirtualPresences({})
          const vp = result.items.find((item) => item.id === connectedVp.id)
          expect(vp?.state).toBe(VirtualPresenceState.Connected)
        },
        60000,
        3000,
      )
    })
  })

  describe('Data Holder Tests', () => {
    it('should list data holders for the virtual presence', async () => {
      const result = await instanceUnderTest.listDataHolders({
        virtualPresenceId: connectedVp.id,
      })

      expect(result).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('should get a data holder by ID if any exist', async () => {
      const listResult = await instanceUnderTest.listDataHolders({
        virtualPresenceId: connectedVp.id,
      })

      if (listResult.items.length > 0) {
        const dataHolder = listResult.items[0]
        const result = await instanceUnderTest.getDataHolder(dataHolder.id)

        expect(result).toBeDefined()
        expect(result?.id).toBe(dataHolder.id)
        expect(result?.domainName).toBe(dataHolder.domainName)
        expect(result?.name).toBeDefined()
        expect(result?.protectionState).toBeDefined()
        expect(result?.version).toBeGreaterThanOrEqual(1)
        expect(result?.createdAt).toBeInstanceOf(Date)
        expect(result?.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('should return undefined for a non-existent data holder', async () => {
      const result = await instanceUnderTest.getDataHolder(
        'non-existent-data-holder-id',
      )
      expect(result).toBeUndefined()
    })
  })

  describe('Analysis Result Tests', () => {
    it('should list analysis results for the virtual presence', async () => {
      const result = await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: connectedVp.id,
      })

      expect(result).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('should get an analysis result by ID if any exist', async () => {
      const listResult = await instanceUnderTest.listAnalysisResults({
        virtualPresenceId: connectedVp.id,
      })

      if (listResult.items.length > 0) {
        const analysisResult = listResult.items[0]
        const result = await instanceUnderTest.getAnalysisResult(
          analysisResult.id,
        )

        expect(result).toBeDefined()
        expect(result?.id).toBe(analysisResult.id)
        expect(result?.virtualPresenceId).toBe(connectedVp.id)
        expect(result?.dataHolderIdentifier).toBeDefined()
        expect(result?.status).toBeDefined()
        expect(result?.lastAnalyzedAt).toBeInstanceOf(Date)
        expect(result?.version).toBeGreaterThanOrEqual(1)
        expect(result?.createdAt).toBeInstanceOf(Date)
        expect(result?.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('should return undefined for a non-existent analysis result', async () => {
      const result = await instanceUnderTest.getAnalysisResult(
        'non-existent-analysis-result-id',
      )
      expect(result).toBeUndefined()
    })
  })

  describe('Subscription Tests', () => {
    it('should subscribe to virtual presence updates and receive connected state', async () => {
      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected

      await instanceUnderTest.subscribeToVirtualPresence(subscriptionId, {
        virtualPresenceUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionState = state
        },
      })

      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromVirtualPresence(subscriptionId)
    })

    it('should subscribe to data holder updates and receive connected state', async () => {
      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected

      await instanceUnderTest.subscribeToDataHolders(subscriptionId, {
        dataHoldersUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionState = state
        },
      })

      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromDataHolders(subscriptionId)
    })

    it('should subscribe to analysis result updates and receive connected state', async () => {
      const subscriptionId = v4()
      let connectionState: ConnectionState = ConnectionState.Disconnected

      await instanceUnderTest.subscribeToAnalysisResult(subscriptionId, {
        analysisResultUpdated(): void {},
        connectionStatusChanged(state: ConnectionState): void {
          connectionState = state
        },
      })

      expect(connectionState).toBe(ConnectionState.Connected)

      instanceUnderTest.unsubscribeFromAnalysisResult(subscriptionId)
    })

    it('should not notify after unsubscribing from virtual presence', async () => {
      const subscriptionId = v4()
      let updateCalled = false

      await instanceUnderTest.subscribeToVirtualPresence(subscriptionId, {
        virtualPresenceUpdated(): void {
          updateCalled = true
        },
        connectionStatusChanged(): void {},
      })

      instanceUnderTest.unsubscribeFromVirtualPresence(subscriptionId)

      // Trigger an action that might emit events
      await instanceUnderTest.rescanVirtualPresence({ id: connectedVp.id })

      await waitForExpect(() => {
        expect(updateCalled).toBeFalsy()
      })
    })
  })
})
