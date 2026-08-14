/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProviderType as ProviderTypeGraphQL } from '../../../../gen/graphqlTypes'
import { ProviderType } from '../../../../public/typings/virtualPresence'
import { ProviderTypeEntity } from '../../../domain/entities/virtual-presence/virtualPresenceEntity'

export class ProviderTypeTransformer {
  fromEntityToAPI(entity: ProviderTypeEntity): ProviderType {
    switch (entity) {
      case ProviderTypeEntity.Email:
        return ProviderType.Email
      case ProviderTypeEntity.Unknown:
        return ProviderType.Unknown
    }
  }

  fromGraphQLToEntity(data: ProviderTypeGraphQL): ProviderTypeEntity {
    switch (data) {
      case 'EMAIL':
        return ProviderTypeEntity.Email
      default:
        return ProviderTypeEntity.Unknown
    }
  }
}
