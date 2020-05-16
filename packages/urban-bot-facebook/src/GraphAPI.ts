/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

import requestPromise from 'request-promise';
import camelCase from 'camelcase';
import { FacebookOptions } from './UrbanBotFacebook';

export class GraphAPI {
    constructor(public options: FacebookOptions) {}

    callSendAPI(requestBody: any) {
        return requestPromise({
            uri: `${this.options.apiUrl}/me/messages`,
            qs: {
                access_token: this.options.pageAccessToken,
            },
            method: 'POST',
            json: requestBody,
        }).catch((error) => {
            console.error('Unable to send message:', error);
        });
    }

    callMessengerProfileAPI(requestBody: any) {
        // Send the HTTP request to the Messenger Profile API

        console.log(`Setting Messenger Profile for app ${this.options.appId}`);
        return requestPromise({
            uri: `${this.options.apiUrl}/me/messenger_profile`,
            qs: {
                access_token: this.options.pageAccessToken,
            },
            method: 'POST',
            json: requestBody,
        }).catch((error) => {
            console.error('Unable to send message:', error);
        });
    }

    callSubscriptionsAPI(customFields: any) {
        // Send the HTTP request to the Subscriptions Edge to configure your webhook
        // You can use the Graph API's /{app-id}/subscriptions edge to configure and
        // manage your app's Webhooks product
        // https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
        console.log(`Setting app ${this.options.appId} callback url to ${this.options.webhookUrl}`);

        let fields = 'messages, messaging_postbacks, messaging_optins, \
      message_deliveries, messaging_referrals';

        if (customFields !== undefined) {
            fields = fields + ', ' + customFields;
        }

        console.log(fields);

        return requestPromise({
            uri: `${this.options.apiUrl}/${this.options.appId}/subscriptions`,
            qs: {
                access_token: this.options.appId + '|' + this.options.appSecret,
                object: 'page',
                callback_url: this.options.webhookUrl,
                verify_token: this.options.verifyToken,
                fields: fields,
                include_values: 'true',
            },
            method: 'POST',
        }).catch((error) => {
            console.error('Unable to send message:', error);
        });
    }

    callSubscribedApps(customFields: any) {
        // Send the HTTP request to subscribe an app for Webhooks for Pages
        // You can use the Graph API's /{page-id}/subscribed_apps edge to configure
        // and manage your pages subscriptions
        // https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
        console.log(`Subscribing app ${this.options.appId} to page ${this.options.pageId}`);

        let fields = 'messages, messaging_postbacks, messaging_optins, \
      message_deliveries, messaging_referrals';

        if (customFields !== undefined) {
            fields = fields + ', ' + customFields;
        }

        return requestPromise({
            uri: `${this.options.apiUrl}/${this.options.pageId}/subscribed_apps`,
            qs: {
                access_token: this.options.pageAccessToken,
                subscribed_fields: fields,
            },
            method: 'POST',
        }).catch((error) => {
            console.error('Unable to send message:', error);
        });
    }

    async getUserProfile(senderPsid: any) {
        try {
            const userProfile = (await this.callUserProfileAPI(senderPsid)) as any;

            for (const key in userProfile) {
                const camelizedKey = camelCase(key);
                const value = userProfile[key];
                delete userProfile[key];
                userProfile[camelizedKey] = value;
            }

            return userProfile;
        } catch (err) {
            console.log('Fetch failed:', err);
        }
    }

    callUserProfileAPI(senderPsid: any) {
        return requestPromise({
            uri: `${this.options.apiUrl}/${senderPsid}`,
            qs: {
                access_token: this.options.pageAccessToken,
                fields: 'first_name, last_name, gender, locale, timezone',
            },
            method: 'GET',
        }).catch((error) => {
            console.error('Unable to fetch profile:' + error);
        });
    }

    getPersonaAPI() {
        return requestPromise({
            uri: `${this.options.apiUrl}/me/personas`,
            qs: {
                access_token: this.options.pageAccessToken,
            },
            method: 'GET',
        }).catch((error) => {
            console.error('Unable to fetch personas:' + error);
        });
    }

    postPersonaAPI(name: string, profile_picture_url: string) {
        const requestBody = {
            name,
            profile_picture_url,
        };

        return requestPromise({
            uri: `${this.options.apiUrl}/me/personas`,
            qs: {
                access_token: this.options.pageAccessToken,
            },
            method: 'POST',
            json: requestBody,
        }).catch((error) => {
            console.error('Unable to create a persona', error);
        });
    }

    callNLPConfigsAPI() {
        // Send the HTTP request to the Built-in NLP Configs API
        // https://developers.facebook.com/docs/graph-api/reference/page/nlp_configs/

        console.log(`Enable Built-in NLP for Page ${this.options.pageId}`);
        return requestPromise({
            uri: `${this.options.apiUrl}/me/nlp_configs`,
            qs: {
                access_token: this.options.pageAccessToken,
                nlp_enabled: true,
            },
            method: 'POST',
        }).catch((error) => {
            console.error('Unable to activate built-in NLP:', error);
        });
    }

    callFBAEventsAPI(senderPsid: any, eventName: any) {
        // Construct the message body
        const requestBody = {
            event: 'CUSTOM_APP_EVENTS',
            custom_events: JSON.stringify([
                {
                    _eventName: 'postback_payload',
                    _value: eventName,
                    _origin: 'original_coast_clothing',
                },
            ]),
            advertiser_tracking_enabled: 1,
            application_tracking_enabled: 1,
            extinfo: JSON.stringify(['mb1']),
            page_id: this.options.pageId,
            page_scoped_user_id: senderPsid,
        };

        // Send the HTTP request to the Activities API
        return requestPromise({
            uri: `${this.options.apiUrl}/${this.options.appId}/activities`,
            method: 'POST',
            form: requestBody,
        }).catch((error) => {
            console.error(`Unable to send FBA event '${eventName}':` + error);
        });
    }
}
