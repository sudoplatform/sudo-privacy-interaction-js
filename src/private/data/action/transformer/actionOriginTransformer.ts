/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionOrigin as ActionOriginGraphQL } from '../../../../gen/graphqlTypes'
import { ActionOrigin } from '../../../../public'
import { ActionOriginEntity } from '../../../domain/entities/action/actionEntity'

export class ActionOriginTransformer {
  fromEntityToAPI(entity: ActionOriginEntity): ActionOrigin {
    switch (entity) {
      case ActionOriginEntity.Static:
        return ActionOrigin.Static
      case ActionOriginEntity.Analysis:
        return ActionOrigin.Analysis
      case ActionOriginEntity.Discovery:
        return ActionOrigin.Discovery
      case ActionOriginEntity.Unknown:
        return ActionOrigin.Unknown
    }
  }

  fromGraphQLToEntity(data: ActionOriginGraphQL): ActionOriginEntity {
    switch (data) {
      case 'STATIC':
        return ActionOriginEntity.Static
      case 'ANALYSIS':
        return ActionOriginEntity.Analysis
      case 'DISCOVERY':
        return ActionOriginEntity.Discovery
      default:
        return ActionOriginEntity.Unknown
    }
  }
}
