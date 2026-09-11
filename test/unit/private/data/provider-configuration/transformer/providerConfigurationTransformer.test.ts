/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FatalError } from '@sudoplatform/sudo-common'
import { ProviderConfigurationTransformer } from '../../../../../../src/private/data/provider-configuration/transformer/providerConfigurationTransformer'
import { APIDataFactory } from '../../../../../data-factory/api'
import { EntityDataFactory } from '../../../../../data-factory/entity'

describe('ProviderConfigurationTransformer Test Suite', () => {
  const instanceUnderTest = new ProviderConfigurationTransformer()

  describe('fromGraphQLToEntity', () => {
    it('decodes base-64 encoded configuration data to entities correctly', () => {
      expect(
        instanceUnderTest.fromGraphQLToEntity(
          EntityDataFactory.providerConfigurationData,
        ),
      ).toStrictEqual(EntityDataFactory.providerConfigurations)
    })

    it('throws a FatalError when the data is not valid base-64 JSON', () => {
      expect(() =>
        instanceUnderTest.fromGraphQLToEntity('not-valid-base64-json'),
      ).toThrow(FatalError)
    })
  })

  describe('fromEntityToAPI', () => {
    it('transforms entity to API provider configuration correctly', () => {
      expect(
        instanceUnderTest.fromEntityToAPI(
          EntityDataFactory.providerConfiguration,
        ),
      ).toStrictEqual(APIDataFactory.providerConfiguration)
    })
  })
})
