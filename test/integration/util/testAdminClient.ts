/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs'

/**
 * NOTE: This will be replaced with a separate admin library long term as part of PPIM-116
 *
 * Test-only client for the admin API. Authenticated with an API key and used to
 * preload / clean up test emails so the discovery analysis pipeline can be tested.
 */

const ADMIN_API_URL =
  'https://r42u27ucpre5fjtc72eb56gs3i.appsync-api.us-east-1.amazonaws.com/graphql'

export interface CreateTestEmailInput {
  owner: string
  emailAddress: string
  from: string
  internalDateEpochMs: number
  labelIds: string[]
  listUnsubscribeHeader?: string
  subject?: string
  expiresInHours?: number
}

export interface TestEmail {
  id: string
  emailAddress: string
  from: string
  internalDateEpochMs: number
  labelIds: string[]
  listUnsubscribeHeader?: string | null
  subject?: string | null
  owner: string
  version: number
  createdAtEpochMs: number
  updatedAtEpochMs: number
}

interface GraphQLResponse<T> {
  data?: T
  errors?: { message: string }[]
}

const CREATE_TEST_EMAILS_MUTATION = `
  mutation CreateTestEmails($input: CreateTestEmailsInput!) {
    createTestEmails(input: $input) {
      id
      emailAddress
      from
      internalDateEpochMs
      labelIds
      listUnsubscribeHeader
      subject
      owner
      version
      createdAtEpochMs
      updatedAtEpochMs
    }
  }
`

const DELETE_TEST_EMAILS_MUTATION = `
  mutation DeleteTestEmails($ids: [ID!]!) {
    deleteTestEmails(ids: $ids)
  }
`

/**
 * Minimal GraphQL client for the admin API, authenticated with an
 * AppSync API key.
 */
export class TestAdminClient {
  private readonly apiUrl: string
  private readonly apiKey: string

  constructor() {
    const adminApiKeyFile = 'config/admin_api_key.secret'
    let adminApiKey: string | undefined
    if (fs.existsSync(adminApiKeyFile)) {
      adminApiKey = fs.readFileSync(adminApiKeyFile).toString().trim()
    } else {
      adminApiKey = process.env.ADMIN_API_KEY?.trim()
    }
    this.apiUrl = ADMIN_API_URL
    this.apiKey = adminApiKey!
  }

  private async execute<T>(
    query: string,
    variables: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `Test email admin API request failed: ${response.status} ${text}`,
      )
    }
    const body = (await response.json()) as GraphQLResponse<T>
    if (body.errors && body.errors.length > 0) {
      throw new Error(
        `Test email admin API returned errors: ${body.errors
          .map((e) => e.message)
          .join('; ')}`,
      )
    }
    if (!body.data) {
      throw new Error('Test email admin API returned no data')
    }
    return body.data
  }

  async createTestEmails(emails: CreateTestEmailInput[]): Promise<TestEmail[]> {
    const data = await this.execute<{ createTestEmails: TestEmail[] }>(
      CREATE_TEST_EMAILS_MUTATION,
      { input: { emails } },
    )
    return data.createTestEmails
  }

  async deleteTestEmails(ids: string[]): Promise<string[]> {
    const data = await this.execute<{ deleteTestEmails: string[] }>(
      DELETE_TEST_EMAILS_MUTATION,
      { ids },
    )
    return data.deleteTestEmails
  }
}
