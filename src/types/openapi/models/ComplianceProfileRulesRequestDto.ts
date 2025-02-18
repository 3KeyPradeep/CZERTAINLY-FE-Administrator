// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 1.6.1-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type {
    ComplianceRequestRulesDto,
} from './';

/**
 * Rules to be associated with the Compliance Profile. Profiles can be created without rules and can be added later
 * @export
 * @interface ComplianceProfileRulesRequestDto
 */
export interface ComplianceProfileRulesRequestDto {
    /**
     * UUID of the Compliance Provider
     * @type {string}
     * @memberof ComplianceProfileRulesRequestDto
     */
    connectorUuid: string;
    /**
     * Kind of the Compliance Provider
     * @type {string}
     * @memberof ComplianceProfileRulesRequestDto
     */
    kind: string;
    /**
     * Rules for new Compliance Profiles
     * @type {Array<ComplianceRequestRulesDto>}
     * @memberof ComplianceProfileRulesRequestDto
     */
    rules?: Array<ComplianceRequestRulesDto>;
    /**
     * Groups for Compliance Profile
     * @type {Array<string>}
     * @memberof ComplianceProfileRulesRequestDto
     */
    groups?: Array<string>;
}
