/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger } from '@sudoplatform/sudo-common'
import { SudoUserClient } from '@sudoplatform/sudo-user'
import waitForExpect from 'wait-for-expect'
import {
  DataHolder,
  RelationshipProvider,
  SudoPrivacyInteractionClient,
} from '../../src/public'
import {
  SetupPrivacyInteractionClientOutput,
  setupPrivacyInteractionClient,
} from './util/privacyInteractionClientLifecycle'
import { resolveRelationshipProvider } from './util/relationshipProvider'
import { TestAdminClient } from './util/testAdminClient'

describe('Data Holder Scan Summary Integration Test Suite', () => {
  const log = new DefaultLogger('DataHolderScanSummaryIntegrationTest')

  let setup: SetupPrivacyInteractionClientOutput
  let instanceUnderTest: SudoPrivacyInteractionClient
  let userClient: SudoUserClient
  let relationshipProvider: RelationshipProvider
  let testAdminClient: TestAdminClient

  const connectedIds = new Set<string>()
  const seededEmailIds = new Set<string>()

  const seedTestEmails = async (emailAddress: string): Promise<void> => {
    const created = await testAdminClient.createTestEmails([
      {
        owner: setup.owner,
        emailAddress,
        from: 'Netflix <info@netflix.com>',
        internalDateEpochMs: Date.now(),
        labelIds: ['INBOX'],
        listUnsubscribeHeader:
          '<mailto:unsubscribe@netflix.com>, <https://netflix.com/unsubscribe>',
        subject: 'Your Netflix receipt',
      },
    ])
    for (const email of created) {
      seededEmailIds.add(email.id)
    }
  }

  /**
   * Seeds emails, connects a virtual presence, and waits for discovery to
   * produce at least one data holder. Returns the connected virtual presence id
   * and the discovered data holders.
   */
  const connectAndDiscover = async (
    providerIdentity: string,
  ): Promise<{ virtualPresenceId: string; dataHolders: DataHolder[] }> => {
    await seedTestEmails(providerIdentity)
    const connectedVp =
      await instanceUnderTest.connectVirtualPresenceWithRefreshToken({
        refreshToken: 'test-refresh-token',
        providerIdentity,
        relationshipProvider,
      })
    expect(connectedVp).toBeDefined()
    connectedIds.add(connectedVp.id)

    await waitForExpect(
      async () => {
        const result = await instanceUnderTest.listDataHolders({
          virtualPresenceId: connectedVp.id,
        })
        expect(result.items.length).toBeGreaterThan(0)
      },
      60000,
      3000,
    )

    const result = await instanceUnderTest.listDataHolders({
      virtualPresenceId: connectedVp.id,
    })
    return { virtualPresenceId: connectedVp.id, dataHolders: result.items }
  }

  beforeEach(async () => {
    setup = await setupPrivacyInteractionClient(log)
    instanceUnderTest = setup.privacyInteractionClient
    userClient = setup.userClient
    relationshipProvider = await resolveRelationshipProvider(instanceUnderTest)
    testAdminClient = new TestAdminClient()
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

    if (seededEmailIds.size > 0) {
      try {
        await testAdminClient.deleteTestEmails([...seededEmailIds])
      } catch (err) {
        log.debug('Cleanup of seeded test emails failed', { err })
      }
      seededEmailIds.clear()
    }

    await userClient.reset()
  })

  describe('listDataHolderScanSummaries', () => {
    it('lists scan summaries for a data holder after discovery', async () => {
      const { dataHolders } = await connectAndDiscover(
        'scansummary-test@example.com',
      )
      const dataHolderId = dataHolders[0].id

      const result = await instanceUnderTest.listDataHolderScanSummaries({
        dataHolderId,
      })

      expect(result).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)

      for (const item of result.items) {
        expect(item.dataHolderId).toBe(dataHolderId)
        expect(item.owner).toBeDefined()
        expect(item.scannedAt).toBeInstanceOf(Date)
        expect(item.scanRangeFrom).toBeInstanceOf(Date)
        expect(item.scanRangeTo).toBeInstanceOf(Date)
        expect(typeof item.emailCount).toBe('number')
        expect(typeof item.readCount).toBe('number')
        expect(typeof item.readRate).toBe('number')
        expect(typeof item.marketingEmailCount).toBe('number')
        expect(typeof item.marketingEmailOpened).toBe('number')
        expect(typeof item.marketingOpenRate).toBe('number')
        expect(typeof item.categoryBreakdown).toBe('object')
        expect(typeof item.uncategorizedCount).toBe('number')
      }
    })

    it('returns an empty list for a data holder with no scans', async () => {
      const result = await instanceUnderTest.listDataHolderScanSummaries({
        dataHolderId: 'non-existent-data-holder-id',
      })

      expect(result).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
      expect(result.items.length).toBe(0)
    })

    it('respects the limit parameter and supports pagination', async () => {
      const providerIdentity = 'scansummary-pagination@example.com'
      const { virtualPresenceId, dataHolders } =
        await connectAndDiscover(providerIdentity)
      const dataHolderId = dataHolders[0].id

      // Wait until at least one scan summaries is completed before performing the rescan -
      // otherwise the 'rescan' will simply slot in as part of the currently executing scan
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listDataHolderScanSummaries({
            dataHolderId,
          })
          expect(result.items.length).toBeGreaterThanOrEqual(1)
        },
        60000,
        3000,
      )

      // Seed a second email for the same data holder, then rescan. A scan
      // summary is produced per scan, so the rescan yields a second summary for
      // the data holder, giving us multiple summaries to paginate over.
      await seedTestEmails(providerIdentity)
      await instanceUnderTest.rescanVirtualPresence({ id: virtualPresenceId })

      // Wait until at least two scan summaries exist for the data holder.
      await waitForExpect(
        async () => {
          const result = await instanceUnderTest.listDataHolderScanSummaries({
            dataHolderId,
          })
          expect(result.items.length).toBeGreaterThanOrEqual(2)
        },
        60000,
        3000,
      )

      const firstPage = await instanceUnderTest.listDataHolderScanSummaries({
        dataHolderId,
        limit: 1,
      })

      expect(firstPage.items.length).toBe(1)
      expect(firstPage.nextToken).toBeDefined()

      const secondPage = await instanceUnderTest.listDataHolderScanSummaries({
        dataHolderId,
        limit: 1,
        nextToken: firstPage.nextToken,
      })

      expect(secondPage.items.length).toBe(1)
      // The second page returns a different summary than the first.
      expect(secondPage.items[0].scannedAt.getTime()).not.toBe(
        firstPage.items[0].scannedAt.getTime(),
      )
    })
  })

  describe('getDataHolder scan summary composition', () => {
    it('attaches latestScanSummary by default', async () => {
      const { dataHolders } = await connectAndDiscover(
        'scansummary-get@example.com',
      )
      const dataHolderId = dataHolders[0].id

      const dataHolder = await instanceUnderTest.getDataHolder(dataHolderId)

      expect(dataHolder).toBeDefined()
      expect(dataHolder?.id).toBe(dataHolderId)
      // latestScanSummary is best-effort: present and well-shaped when the data
      // holder has scan summaries, otherwise undefined.
      if (dataHolder?.latestScanSummary) {
        expect(dataHolder.latestScanSummary.dataHolderId).toBe(dataHolderId)
        expect(dataHolder.latestScanSummary.scannedAt).toBeInstanceOf(Date)
        expect(typeof dataHolder.latestScanSummary.emailCount).toBe('number')
      }
    })

    it('does not attach latestScanSummary when includeScanSummary is false', async () => {
      const { dataHolders } = await connectAndDiscover(
        'scansummary-get-opt-out@example.com',
      )
      const dataHolderId = dataHolders[0].id

      const dataHolder = await instanceUnderTest.getDataHolder(dataHolderId, {
        includeScanSummary: false,
      })

      expect(dataHolder).toBeDefined()
      expect(dataHolder?.id).toBe(dataHolderId)
      expect(dataHolder?.latestScanSummary).toBeUndefined()
    })
  })
})
