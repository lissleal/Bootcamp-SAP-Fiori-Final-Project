sap.ui.define([
    "com/bootcamp/sapui5/providers/utils/HomeService",
    "sap/ui/model/json/JSONModel"
], function (HomeService, JSONModel) {
    "use strict";

    return {
        init: function (oNorthwindModel) {
            this._oNorthwindModel = oNorthwindModel;
        },

        setInitModelLocalData: function (oComponent) {
            oComponent.setModel(new JSONModel({
                valueInput: '',
                valueName: '',
                selectedKey: '',
                inputProductID: '',
                inputProductName: '',
                inputUnitPrice: '',
                inputUnitsInStock: '',
                mockProducts: [],
            }), "LocalDataModel");
        },

        getDataProviders: async function (oFilters) {
            try {
                return await HomeService.readProviders(this._oNorthwindModel, oFilters);
            } catch (error) {
                console.error("Error al obtener datos de proveedores:", error);
                return [];
            }
        },

        setProviderModel: async function (oController, oDatos) {
            let oListModel =
            oController.getOwnerComponent().getModel('ProviderCollection');
            if(!oListModel){
                const oModel = new JSONModel([]);
                oModel.setSizeLimit(1000000);
                oController.getOwnerComponent().setModel(oModel, "ProviderCollection");
                oListModel =
                oController.getOwnerComponent().getModel('ProviderCollection');
                }
                oListModel.setData(oDatos);
        },
           
    };
});