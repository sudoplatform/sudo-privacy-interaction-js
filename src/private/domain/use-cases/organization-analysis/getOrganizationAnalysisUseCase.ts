/**
 * Copyright © 2026 Anonyome Labs, Inc. All rights reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DefaultLogger, Logger } from '@sudoplatform/sudo-common'
import { OrganizationAnalysisEntity } from '../../entities/organization-analysis/organizationAnalysisEntity'
import {
  GetOrganizationAnalysisInput,
  OrganizationAnalysisService,
} from '../../entities/organization-analysis/organizationAnalysisService'

/**
 * Application business logic for obtaining an organization analysis.
 */
export class GetOrganizationAnalysisUseCase {
  private readonly log: Logger

  public constructor(
    private readonly organizationAnalysisService: OrganizationAnalysisService,
  ) {
    this.log = new DefaultLogger(this.constructor.name)
  }

  async execute(
    input: GetOrganizationAnalysisInput,
  ): Promise<OrganizationAnalysisEntity | undefined> {
    this.log.debug(this.constructor.name, { input })
    return await this.organizationAnalysisService.getOrganizationAnalysis(input)
  }
}
