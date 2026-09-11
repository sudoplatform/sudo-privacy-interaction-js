/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Base64, FatalError } from '@sudoplatform/sudo-common'
import { ProviderType as ProviderTypeGraphQL } from '../../../../gen/graphqlTypes'
import { ProviderConfiguration } from '../../../../public/typings/providerConfiguration'
import { ProviderConfigurationEntity } from '../../../domain/entities/configuration/providerConfigurationEntity'
import { ProviderTypeTransformer } from '../../virtual-presence/transformer/providerTypeTransformer'

/**
 * The shape of a single provider entry within the decoded provider
 * configuration payload returned by the service.
 */
interface DecodedProvider {
  name: string
  providerType: ProviderTypeGraphQL
  clientId: string
}

/**
 * The shape of the decoded provider configuration payload as returned by the
 * service before base-64 encoding.
 */
interface DecodedProviderConfiguration {
  providers: DecodedProvider[]
}

export class ProviderConfigurationTransformer {
  private readonly providerTypeTransformer = new ProviderTypeTransformer()

  /**
   * Decodes the opaque, base-64 encoded provider configuration data into a
   * list of domain entities.
   *
   * @param {string} data The base-64 encoded provider configuration data.
   * @returns {ProviderConfigurationEntity[]} The decoded provider configurations.
   */
  fromGraphQLToEntity(data: string): ProviderConfigurationEntity[] {
    const msg = 'provider configuration cannot be decoded'

    let decodedString: string
    try {
      decodedString = Base64.decodeString(data)
    } catch (err) {
      const error = err as Error
      throw new FatalError(`${msg}: Base64 decoding failed: ${error.message}`)
    }

    let decodedObject: DecodedProviderConfiguration
    try {
      decodedObject = JSON.parse(decodedString) as DecodedProviderConfiguration
    } catch (err) {
      const error = err as Error
      throw new FatalError(`${msg}: JSON parsing failed: ${error.message}`)
    }

    return decodedObject.providers.map((provider) => ({
      name: provider.name,
      providerType: this.providerTypeTransformer.fromGraphQLToEntity(
        provider.providerType,
      ),
      clientId: provider.clientId,
    }))
  }

  fromEntityToAPI(entity: ProviderConfigurationEntity): ProviderConfiguration {
    return {
      name: entity.name,
      providerType: this.providerTypeTransformer.fromEntityToAPI(
        entity.providerType,
      ),
      clientId: entity.clientId,
    }
  }
}
