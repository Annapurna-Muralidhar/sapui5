sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (Controller, JSONModel,formatter,Filter,FilterOperator) => {
	"use strict";
    
	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		formatter:formatter,
        onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
		},

		onFilterInvoices(oEvent) {
			// build filter array
			const aFilter = [];
			const sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			const oList = this.byId("invoiceList");
			const oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);


			  /*We load two new dependencies for the filtering. The filter object will hold our configuration for the filter action and the FilterOperator is a helper type that we need in order to specify the filter.

In the onFilterInvoices function we construct a filter object from the search string that the user has typed in the search field. Event handlers always receive an event argument that can be used to access the parameters that the event provides. In our case the search field defines a parameter query that we access by calling getParameter("query") on the oEvent parameter.

If the query is not empty, we add a new filter object to the still empty array of filters. However, if the query is empty, we filter the binding with an empty array. This makes sure that we see all list elements again. We could also add more filters to the array, if we wanted to search more than one data field. In our example, we just search in the ProductName path and specify a filter operator that will search for the given query string.

The list is accessed with the ID that we have specified in the view, because the control is automatically prefixed by the view ID, we need to ask the view for the control with the helper function byId. On the list control we access the binding of the aggregation items to filter it with our newly constructed filter object. This will automatically filter the list by our search string so that only the matching items are shown when the search is triggered. The filter operator FilterOperator.Contains is not case-sensitive.*/
		},

		onPress() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail");
		}
	});
});