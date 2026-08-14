/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SignalValue as SignalValueGraphQL } from '../../../../gen/graphqlTypes'
import { SignalValue } from '../../../../public/typings/analysisResult'
import { SignalValueEntity } from '../../../domain/entities/analysis-result/analysisResultEntity'

export class SignalValueTransformer {
  fromGraphQLToEntity(data: SignalValueGraphQL): SignalValueEntity {
    switch (data) {
      case 'YES':
        return SignalValueEntity.Yes
      case 'NO':
        return SignalValueEntity.No
      case 'UNKNOWN':
        return SignalValueEntity.Unknown
      default:
        return SignalValueEntity.Unknown
    }
  }

  fromEntityToAPI(entity: SignalValueEntity): SignalValue {
    switch (entity) {
      case SignalValueEntity.Yes:
        return SignalValue.Yes
      case SignalValueEntity.No:
        return SignalValue.No
      case SignalValueEntity.Unknown:
        return SignalValue.Unknown
    }
  }
}
