/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RelationshipProvider as RelationshipProviderGraphQL } from '../../../../gen/graphqlTypes'
import { RelationshipProvider } from '../../../../public/inputs/virtualPresence'
import { RelationshipProviderEntity } from '../../../domain/entities/inputs/relationshipProviderEntity'

export class RelationshipProviderTransformer {
  fromEntityToGraphQL(
    entity: RelationshipProviderEntity,
  ): RelationshipProviderGraphQL {
    switch (entity) {
      case RelationshipProviderEntity.GmailProvider:
        return 'GMAIL_PROVIDER'
      case RelationshipProviderEntity.TestProvider:
        return 'TEST_PROVIDER'
    }
  }

  fromAPIToEntity(data: RelationshipProvider): RelationshipProviderEntity {
    switch (data) {
      case RelationshipProvider.GmailProvider:
        return RelationshipProviderEntity.GmailProvider
      case RelationshipProvider.TestProvider:
        return RelationshipProviderEntity.TestProvider
    }
  }
}
