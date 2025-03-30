sap.ui.define([
    "com/bootcamp/sapui5/providers/utils/HomeService",
], function (HomeService) {
    "use strict";
    return {
        init: function (oNorthwindModel) {
            this._oNorthwindModel = oNorthwindModel;
        },
        getDataProducts: async function () {
            let oFilters = [];
            return HomeService.readProducts(this._oNorthwindModel, oFilters);
        }
    };
});