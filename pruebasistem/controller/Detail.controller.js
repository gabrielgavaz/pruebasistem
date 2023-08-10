sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "../util/formatter"


], function (Controller, Fragment, MessageToast, formatter) {
    "use strict";

    return Controller.extend("pruebasistem.controller.Detail", {
        formatter: formatter,

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteDetail").attachMatched(this._onRouteMatched, this);

            this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "pruebasistem.view.fragment.CreateState", this);
            this.getView().addDependent(this._oDialog);
        },

        //Fragment
        agregarEstado: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            this._oDialog.setBindingContext(oContext).open();
            },
            closeDialog: function() {
            this._oDialog.close();
            },

          onCloseDialog: function () {
              this.byId("dialog").close();
          },


        //match
        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            console.log(oArgs)
            oView = this.getView();
            oView.bindElement({
                path: "/paisSet('" + oArgs.IdPais + "')",
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },




        //crear estado
        onCreateState: function(oEvent) {
            var oView = this.getView();

            // Obtener el IdPais de la ruta de navegación
            var oContext = oEvent.getSource().getBindingContext();
            this._oDialog.setBindingContext(oContext).open();
        
            // Obtener el IdPais de la ruta de navegación
            var sIdPais = this.getView().getBindingContext().getProperty("IdPais");
            console.log("IdPais:", sIdPais);

            //Obtener los valores ingresados en los campos de entrada
            var oModel = oView.getModel();
            var oNewState = {
              IdPais: sIdPais,
              NameEstado: oView.byId("nameEstadoInput").getValue(),
              CapitalEstado: oView.byId("capitalEstadoInput").getValue(),
              PoblacionEstado: oView.byId("poblacionEstadoInput").getValue(),
              SuperficieEstado: oView.byId("superficieEstadoInput").getValue(),
              PuntosdeinteresEstado: oView.byId("puntosdeinteresEstadoInput").getValue(),
              DescripcionEstado: oView.byId("descripcionEstadoInput").getValue()
            };
            console.log(oNewState)
            // Llamar al método create_entity con los datos del nuevo país
            oModel.create("/estadosSet", oNewState, {
              success: function() {
                MessageToast.show("Estado creado exitosamente");
              },
              error: function(oError) {
                MessageToast.error("Error al crear el Estado");
              }
            });
        },

        //abrir el pop up para confirmar delete
        onOpenConfirmation: function(oEvent) {
            if (!this._oConfirmationDialog) {
              var oListItem = oEvent.getSource().getParent().getParent();
              var oContext = oListItem.getBindingContext();
              var sIdEstado = oContext.getProperty("IdEstado");

              
              // Almacena el valor de IdPais en el controlador
              this._IdEstado = sIdEstado;

              // Muestra el ID del país en la consola
              console.log(this._IdEstado + "1");


        
              this._oConfirmationDialog = sap.ui.xmlfragment(this.getView().getId(), "pruebasistem.view.fragment.Confirm", this);
              this.getView().addDependent(this._oConfirmationDialog);


            }
            this._oConfirmationDialog.open();
          },

          //boton para deletear
          onConfirm: function() {
            console.log("Confirmación realizada");
            var sIdEstado = this._IdEstado;
            console.log(sIdEstado + "2")
            var oModel = this.getView().getModel();
            
            oModel.remove("/estadosSet('" + sIdEstado + "')", {
              success: function() {
                // La eliminación fue exitosa
                sap.m.MessageToast.show("El país se eliminó correctamente.");
                this._oConfirmationDialog.destroy(); // Destruye el diálogo
                this._oConfirmationDialog = null; // Reinicia la referencia al diálog

    
              }.bind(this),
              error: function(oError) {
                // Ocurrió un error durante la eliminación
                sap.m.MessageBox.error("Error al eliminar el país: " + oError.message);
              },
            });
        
            this._oConfirmationDialog.close();
          },
          onCancel: function() {
            console.log("Acción cancelada");
            this._oConfirmationDialog.close();
            this._oConfirmationDialog.destroy(); // Destruye el diálogo
            this._oConfirmationDialog = null; // Reinicia la referencia al diálogo
          },





    });
});
