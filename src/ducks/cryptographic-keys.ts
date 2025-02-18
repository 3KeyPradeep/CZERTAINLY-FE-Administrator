import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AttributeDescriptorModel } from "types/attributes";
import { BulkActionModel } from "types/connectors";
import {
   CryptographicKeyAddRequestModel,
   CryptographicKeyBulkCompromiseRequestModel,
   CryptographicKeyCompromiseRequestModel,
   CryptographicKeyDetailResponseModel,
   CryptographicKeyEditRequestModel,
   CryptographicKeyHistoryModel,
   CryptographicKeyItemBulkCompromiseRequestModel,
   CryptographicKeyKeyUsageBulkUpdateRequestModel,
   CryptographicKeyKeyUsageUpdateRequestModel,
   CryptographicKeyPairResponseModel,
   CryptographicKeyResponseModel
} from "types/cryptographic-keys";
import { KeyRequestType, KeyState, KeyUsage } from "types/openapi";
import { createFeatureSelector } from "utils/ducks";
import { SearchFieldListModel, SearchFilterModel, SearchRequestModel } from "../types/certificate";

export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: BulkActionModel[];

   keyAttributeDescriptors?: AttributeDescriptorModel[];

   availableFilters: SearchFieldListModel[];
   currentFilters: SearchFilterModel[];

   totalPages: number;
   totalItems: number;

   cryptographicKey?: CryptographicKeyDetailResponseModel;
   cryptographicKeys: CryptographicKeyResponseModel[];
   cryptographicKeyPairs: CryptographicKeyPairResponseModel[];

   isFetchingAvailableFilters: boolean;
   isFetchingList: boolean;
   isFetchingKeyPairs: boolean;
   isFetchingDetail: boolean;
   isUpdatingKeyUsage: boolean;
   isBulkUpdatingKeyUsage: boolean;

   isCreating: boolean;
   isDeleting: boolean;
   isBulkDeleting: boolean;
   isUpdating: boolean;
   isEnabling: boolean;
   isBulkEnabling: boolean;
   isDisabling: boolean;
   isBulkDisabling: boolean;
   isCompromising: boolean;
   isBulkCompromising: boolean;
   isDestroying: boolean;
   isBulkDestroying: boolean;
   isSyncing: boolean;

   isFetchingAttributes: boolean;

   isFetchingHistory: boolean;

   keyHistory?: {uuid: string, history: CryptographicKeyHistoryModel[]}[];

};

export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   keyAttributeDescriptors: [],

   availableFilters: [],
   currentFilters: [],

   totalPages: 0,
   totalItems: 0,

   cryptographicKeys: [],
   cryptographicKeyPairs: [],

   isFetchingAvailableFilters: false,
   isFetchingList: false,
   isFetchingKeyPairs: false,
   isFetchingDetail: false,
   isUpdatingKeyUsage: false,
   isBulkUpdatingKeyUsage: false,
   isCreating: false,
   isDeleting: false,
   isBulkDeleting: false,
   isUpdating: false,
   isEnabling: false,
   isDisabling: false,
   isBulkEnabling: false,
   isBulkDisabling: false,
   isCompromising: false,
   isBulkCompromising: false,
   isDestroying: false,
   isBulkDestroying: false,
   isSyncing: false,

   isFetchingAttributes: false,

   isFetchingHistory: false,

   keyHistory: [],

};


export const slice = createSlice({

   name: "cryptographicKeys",

   initialState,

   reducers: {

      resetState: (state, action: PayloadAction<void>) => {
         let currentFilterRef = state.currentFilters;
         Object.keys(state).forEach(
            key => { if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined; }
         );

         Object.keys(initialState).forEach(
            key => (state as any)[key] = (initialState as any)[key]
         );
         state.currentFilters = currentFilterRef;

      },

      setCurrentFilters: (state, action: PayloadAction<SearchFilterModel[]>) => {
         state.currentFilters = action.payload;
      },

      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },

      clearKeyAttributeDescriptors: (state, action: PayloadAction<void>) => {

         state.keyAttributeDescriptors = [];

      },

      clearCryptographicKey: (state, action: PayloadAction<void>) => {

         state.cryptographicKey = undefined;

      },


      listCryptographicKeys: (state, action: PayloadAction<SearchRequestModel>) => {

         state.cryptographicKeys = [];
         state.isFetchingList = true;

      },


      listCryptographicKeysSuccess: (state, action: PayloadAction<{ cryptographicKeys: CryptographicKeyResponseModel[], totalPages: number, totalItems: number}>) => {

         state.cryptographicKeys = action.payload.cryptographicKeys;
         state.isFetchingList = false;
         state.totalItems = action.payload.totalItems;
         state.totalPages = action.payload.totalPages;

      },


      listCryptographicKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      listCryptographicKeyPairs: (state, action: PayloadAction<{tokenProfileUuid?: string}>) => {

         state.cryptographicKeyPairs = [];
         state.isFetchingKeyPairs = true;

      },


      listCryptographicKeyPairSuccess: (state, action: PayloadAction<{ cryptographicKeys: CryptographicKeyPairResponseModel[] }>) => {

         state.cryptographicKeyPairs = action.payload.cryptographicKeys;
         state.isFetchingKeyPairs = false;

      },


      listCryptographicKeyPairFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingKeyPairs = false;

      },

      getCryptographicKeyDetail: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string }>) => {

         state.cryptographicKey = undefined;
         state.isFetchingDetail = true;

      },


      getCryptographicKeyDetailSuccess: (state, action: PayloadAction<{ cryptographicKey: CryptographicKeyDetailResponseModel }>) => {

         state.isFetchingDetail = false;
         state.cryptographicKey = action.payload.cryptographicKey;

      },


      getCryptographicKeyDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isSyncing = false;

      },


      syncKeys: (state, action: PayloadAction<{ tokenInstanceUuid: string}>) => {

         state.isSyncing = true;

      },


      syncKeysSuccess: (state, action: PayloadAction<void>) => {

         state.isSyncing = false;

      },


      syncKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isSyncing = false;

      },

      getAvailableKeyFilters: (state, action: PayloadAction<void>) => {
         state.availableFilters = [];
         state.isFetchingAvailableFilters = true;
      },

      getAvailableKeyFiltersSuccess: (state, action: PayloadAction<{ availableKeyFilters: SearchFieldListModel[] }>) => {
         state.isFetchingAvailableFilters = false;
         state.availableFilters = action.payload.availableKeyFilters;
      },

      getAvailableKeyFiltersFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {
         state.isFetchingAvailableFilters = false;
      },

      createCryptographicKey: (state, action: PayloadAction<{
         tokenInstanceUuid: string,
         tokenProfileUuid: string,
         type: KeyRequestType,
         cryptographicKeyAddRequest: CryptographicKeyAddRequestModel
      }>) => {

         state.isCreating = true;

      },

      listAttributeDescriptors: (state, action: PayloadAction<{ tokenInstanceUuid: string, tokenProfileUuid: string, keyRequestType: KeyRequestType }>) => {

         state.isFetchingAttributes = true;

      },


      listAttributeDescriptorsSuccess: (state, action: PayloadAction<{ uuid: string, attributeDescriptors: AttributeDescriptorModel[] }>) => {

         state.isFetchingAttributes = false;

         state.keyAttributeDescriptors = action.payload.attributeDescriptors;

      },


      listAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAttributes = false;

      },


      createCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string , tokenInstanceUuid: string}>) => {

         state.isCreating = false;

      },


      createCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      updateCryptographicKey: (state, action: PayloadAction<{
         profileUuid: string,
         tokenInstanceUuid: string,
         cryptographicKeyEditRequest: CryptographicKeyEditRequestModel,
         redirect?: string
      }>) => {

         state.isUpdating = true;

      },


      updateCryptographicKeySuccess: (state, action: PayloadAction<{ cryptographicKey: CryptographicKeyDetailResponseModel, redirect?: string }>) => {

         state.isUpdating = false;
         state.cryptographicKey = action.payload.cryptographicKey;

      },


      updateCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false;

      },


      enableCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isEnabling = true;

      },


      enableCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isEnabling = false;
         
         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.enabled = true;
            });
         }
         else{
            state.cryptographicKey?.items.forEach((keyItem) => {
               keyItem.enabled = true;
            });
         }
      },


      enableCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isEnabling = false;

      },


      disableCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDisabling = true;

      },


      disableCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDisabling = false;
         
         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.enabled = false;
            });
         }
         else{
            state.cryptographicKey?.items.forEach((keyItem) => {
               keyItem.enabled = false;
            });
         }
      },


      disableCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDisabling = false;

      },


      deleteCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string>, redirect?:string }>) => {

         state.isDeleting = true;

      },


      deleteCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string>, redirect?: string }>) => {

         state.isDeleting = false;

         const index = state.cryptographicKeys.findIndex(cryptographicKey => cryptographicKey.uuid === action.payload.uuid);
         if(action.payload.keyItemUuid.length === state.cryptographicKey?.items.length) {
            if (index !== -1) state.cryptographicKeys.splice(index, 1);
            if (state.cryptographicKey?.uuid === action.payload.uuid) state.cryptographicKey = undefined;
         } else {
                  action.payload.keyItemUuid.map(keyUuid => 
                  {
                     const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyUuid);
                     if (keyItem) {
                        const keyItemIndex = state.cryptographicKey?.items.indexOf(keyItem);
                        if (keyItemIndex !== undefined && keyItemIndex !== -1) {
                           state.cryptographicKey?.items.splice(keyItemIndex, 1);
                        }                     }
                        return null;
                     }
               
               );
         }
      },


      deleteCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false;

      },


      compromiseCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, request: CryptographicKeyCompromiseRequestModel }>) => {

         state.isCompromising = true;

      },


      compromiseCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, request: CryptographicKeyCompromiseRequestModel }>) => {

         state.isCompromising = false;

         if(action.payload.request.uuids){
            action.payload.request.uuids.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.state = KeyState.Compromised;
               if (keyItem) keyItem.reason = action.payload.request.reason;
            });
         }
         else{
               state.cryptographicKey?.items.forEach((keyItem) => {
                  keyItem.state = KeyState.Compromised;
                  keyItem.reason = action.payload.request.reason;
               });
         }
      },


      compromiseCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCompromising = false;
         
      },


      destroyCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDestroying = true;

      },


      destroyCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDestroying = false;

         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.state = KeyState.Destroyed;
            });
         }
         else{
               state.cryptographicKey?.items.forEach((keyItem) => {
                  keyItem.state = KeyState.Destroyed;
               });
         }
      },


      destroyCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDestroying = false;
         
      },


      bulkDeleteCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const index = state.cryptographicKeys.findIndex(cryptographicKey => cryptographicKey.uuid === uuid);
               if (index >= 0) state.cryptographicKeys.splice(index, 1);
            }

         );

         if (state.cryptographicKey && action.payload.uuids.includes(state.cryptographicKey.uuid)) state.cryptographicKey = undefined;

      },


      bulkDeleteCryptographicKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkDeleteCryptographicKeyItems: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteCryptographicKeyItemsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const keyItemIndex = state.cryptographicKeys.findIndex(keyItem => keyItem.uuid === uuid);
               if (keyItemIndex >= 0) state.cryptographicKeys.splice(keyItemIndex, 1);
            }

         );

         if (state.cryptographicKey && action.payload.uuids.includes(state.cryptographicKey.uuid)) state.cryptographicKey = undefined;

      },


      bulkDeleteCryptographicKeyItemsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkEnableCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

      },


      bulkEnableCryptographicKeysFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkEnabling = false;

      },

      bulkEnableCryptographicKeyItems: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableCryptographicKeyItemsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

         action.payload.uuids.forEach(

            uuid => {
                  const keyItemIndex = state.cryptographicKeys.findIndex(keyItem => keyItem.uuid === uuid);
                  if (keyItemIndex >= 0) state.cryptographicKeys[keyItemIndex].enabled = true;
            }

         );


      },


      bulkEnableCryptographicKeyItemsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkEnabling = false;

      },


      bulkDisableCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

      },


      bulkDisableCryptographicKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDisabling = false;

      },

      bulkDisableCryptographicKeyItems: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableCryptographicKeyItemsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

         action.payload.uuids.forEach(

            uuid => {
                  const keyItemIndex = state.cryptographicKeys.findIndex(keyItem => keyItem.uuid === uuid);
                  if (keyItemIndex >= 0) state.cryptographicKeys[keyItemIndex].enabled = false;
            }

         );


      },


      bulkDisableCryptographicKeyItemsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDisabling = false;

      },
      
      updateKeyUsage: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, usage: CryptographicKeyKeyUsageUpdateRequestModel }>) => {

         state.isUpdatingKeyUsage = true;

      },


      updateKeyUsageSuccess: (state, action: PayloadAction<{ uuid: string, keyItemsUuid: Array<string>, usage: Array<KeyUsage> }>) => {

         state.isUpdatingKeyUsage = false;
         
         if(action.payload.keyItemsUuid && action.payload.keyItemsUuid.length > 0) {
            action.payload.keyItemsUuid.forEach(keyItemUuid => {
               const index = state.cryptographicKey!.items.findIndex(keyItem => keyItem.uuid === keyItemUuid);
               if (index >= 0) state.cryptographicKey!.items[index].usage = action.payload.usage;
            });
         } else {
            state.cryptographicKey?.items.forEach(keyItem => {
               keyItem.usage = action.payload.usage;
            });
         }
      },


      updateKeyUsageFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdatingKeyUsage = false;

      },


      bulkUpdateKeyUsage: (state, action: PayloadAction<{ usage: CryptographicKeyKeyUsageBulkUpdateRequestModel }>) => {

         state.isBulkUpdatingKeyUsage = true;

      },


      bulkUpdateKeyUsageSuccess: (state, action: PayloadAction<{ }>) => {

         state.isBulkUpdatingKeyUsage = false;

      },


      bulkUpdateKeyUsageFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkUpdatingKeyUsage = false;

      },

      bulkUpdateKeyItemUsage: (state, action: PayloadAction<{ usage: CryptographicKeyKeyUsageBulkUpdateRequestModel }>) => {

         state.isBulkUpdatingKeyUsage = true;

      },


      bulkUpdateKeyItemUsageSuccess: (state, action: PayloadAction<{usages: Array<KeyUsage>, uuids: Array<string> }>) => {

         state.isBulkUpdatingKeyUsage = false;

         if(action.payload.uuids && action.payload.uuids.length === 1) {
            const index = state.cryptographicKey!.items.findIndex(keyItem => keyItem.uuid === action.payload.uuids[0]);
            if (index >= 0) state.cryptographicKey!.items[index].usage = action.payload.usages;
         }
      },


      bulkUpdateKeyItemUsageFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkUpdatingKeyUsage = false;

      },


      bulkCompromiseCryptographicKeys: (state, action: PayloadAction<{ request: CryptographicKeyBulkCompromiseRequestModel }>) => {

         state.isBulkCompromising = true;

      },


      bulkCompromiseCryptographicKeysSuccess: (state, action: PayloadAction<{ request: CryptographicKeyBulkCompromiseRequestModel }>) => {

         state.isBulkCompromising = false;

      },


      bulkCompromiseCryptographicKeysFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkCompromising = false;

      },

      bulkCompromiseCryptographicKeyItems: (state, action: PayloadAction<{ request: CryptographicKeyItemBulkCompromiseRequestModel }>) => {

         state.isBulkCompromising = true;

      },


      bulkCompromiseCryptographicKeyItemsSuccess: (state, action: PayloadAction<{ request: CryptographicKeyItemBulkCompromiseRequestModel }>) => {

         state.isBulkCompromising = false;

         action.payload.request.uuids?.forEach(

            uuid => {
                  const keyItemIndex = state.cryptographicKeys.findIndex(keyItem => keyItem.uuid === uuid);
                  if (keyItemIndex >= 0) {state.cryptographicKeys[keyItemIndex].state = KeyState.Compromised};
            }

         );

      },


      bulkCompromiseCryptographicKeyItemsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkCompromising = false;

      },


      bulkDestroyCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDestroying = true;

      },


      bulkDestroyCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDestroying = false;

      },


      bulkDestroyCryptographicKeysFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkDestroying = false;

      },

      bulkDestroyCryptographicKeyItems: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDestroying = true;

      },


      bulkDestroyCryptographicKeyItemsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDestroying = false;

         action.payload.uuids.forEach(

            uuid => {
               const keyItemIndex = state.cryptographicKeys.findIndex(keyItem => keyItem.uuid === uuid);
               if (keyItemIndex >= 0) state.cryptographicKeys[keyItemIndex].state = KeyState.Destroyed;
            }

         );

      },


      bulkDestroyCryptographicKeyItemsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDestroying = false;

      },

      getHistory: (state, action: PayloadAction<{ tokenInstanceUuid: string, keyUuid: string, keyItemUuid: string }>) => {

         // set key history for the uuid as empty array
         state.keyHistory?.forEach(keyHistoryItem => {
            if (keyHistoryItem.uuid === action.payload.keyItemUuid) {
               state.keyHistory?.splice(state.keyHistory?.indexOf(keyHistoryItem), 1);
            }
         });
         state.isFetchingHistory = true;

      },


      getHistorySuccess: (state, action: PayloadAction<{ keyItemUuid: string, keyHistory: CryptographicKeyHistoryModel[] }>) => {

         state.isFetchingHistory = false;
         state.keyHistory?.push({ uuid: action.payload.keyItemUuid, history: action.payload.keyHistory });

      },


      getHistoryFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingHistory = false;

      },
   }

});


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const cryptographicKey = createSelector(state, (state: State) => state.cryptographicKey);
const cryptographicKeys = createSelector(state, (state: State) => state.cryptographicKeys);
const cryptographicKeyPairs = createSelector(state, (state: State) => state.cryptographicKeyPairs);

const availableKeyFilters = createSelector(state, state => state.availableFilters);
const currentKeyFilters = createSelector(state, state => state.currentFilters);

const totalItems = createSelector(state, state => state.totalItems);
const totalPages = createSelector(state, state => state.totalPages);

const isFetchingAvailableFilters = createSelector(state, state => state.isFetchingAvailableFilters);
const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingKeyPairs = createSelector(state, (state: State) => state.isFetchingKeyPairs);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);
const isEnabling = createSelector(state, (state: State) => state.isEnabling);
const isBulkEnabling = createSelector(state, (state: State) => state.isBulkEnabling);
const isDisabling = createSelector(state, (state: State) => state.isDisabling);
const isBulkDisabling = createSelector(state, (state: State) => state.isBulkDisabling);
const isCompromising = createSelector(state, (state: State) => state.isCompromising);
const isBulkCompromising = createSelector(state, (state: State) => state.isBulkCompromising);
const isDestroying = createSelector(state, (state: State) => state.isDestroying);
const isBulkDestroying = createSelector(state, (state: State) => state.isBulkDestroying);
const isSyncing = createSelector(state, (state: State) => state.isSyncing);

const isUpdatingKeyUsage = createSelector(state, (state: State) => state.isUpdatingKeyUsage);
const isBulkUpdatingKeyUsage = createSelector(state, (state: State) => state.isBulkUpdatingKeyUsage);

const isFetchingAttributes = createSelector(state, (state: State) => state.isFetchingAttributes);
const keyAttributeDescriptors = createSelector(state, (state: State) => state.keyAttributeDescriptors);

const isFetchingHistory = createSelector(state, (state: State) => state.isFetchingHistory);
const keyHistory = createSelector(state, (state: State) => state.keyHistory);



export const selectors = {

   state,

   checkedRows,

   cryptographicKey,
   cryptographicKeys,
   cryptographicKeyPairs,

   availableKeyFilters,
   currentKeyFilters,

   totalItems,
   totalPages,

   isFetchingAvailableFilters,
   isFetchingList,
   isFetchingKeyPairs,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isBulkDeleting,
   isUpdating,
   isEnabling,
   isBulkEnabling,
   isDisabling,
   isBulkDisabling,
   isCompromising,
   isBulkCompromising,
   isDestroying,
   isBulkDestroying,
   isSyncing,

   isUpdatingKeyUsage,
   isBulkUpdatingKeyUsage,

   isFetchingAttributes,
   keyAttributeDescriptors,

   isFetchingHistory,
   keyHistory,

};


export const actions = slice.actions;


export default slice.reducer;
