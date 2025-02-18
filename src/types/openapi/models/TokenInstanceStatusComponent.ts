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
    TokenInstanceStatus,
} from './';

/**
 * Components of the Token instance status
 * @export
 * @interface TokenInstanceStatusComponent
 */
export interface TokenInstanceStatusComponent {
    /**
     * @type {TokenInstanceStatus}
     * @memberof TokenInstanceStatusComponent
     */
    status: TokenInstanceStatus;
    /**
     * Token instance component details
     * @type {{ [key: string]: object; }}
     * @memberof TokenInstanceStatusComponent
     */
    details?: { [key: string]: object; };
}


