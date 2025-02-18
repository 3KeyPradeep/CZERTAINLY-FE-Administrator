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
    CertificateValidationStatus,
} from './';

/**
 * @export
 * @interface CertificateValidationDto
 */
export interface CertificateValidationDto {
    /**
     * @type {CertificateValidationStatus}
     * @memberof CertificateValidationDto
     */
    status?: CertificateValidationStatus;
    /**
     * @type {string}
     * @memberof CertificateValidationDto
     */
    message?: string;
}


