(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12],{

/***/ "./node_modules/@ionic/core/dist/esm/legacy/ion-action-sheet-controller_8.entry.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/legacy/ion-action-sheet-controller_8.entry.js ***!
  \*****************************************************************************************/
/*! exports provided: ion_action_sheet_controller, ion_alert_controller, ion_anchor, ion_loading_controller, ion_modal_controller, ion_picker_controller, ion_popover_controller, ion_toast_controller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_action_sheet_controller", function() { return ActionSheetController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_alert_controller", function() { return AlertController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_anchor", function() { return Anchor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_loading_controller", function() { return LoadingController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_modal_controller", function() { return ModalController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_picker_controller", function() { return PickerController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_popover_controller", function() { return PopoverController; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ion_toast_controller", function() { return ToastController; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chunk-09ec7fc0.js */ "./node_modules/@ionic/core/dist/esm/legacy/chunk-09ec7fc0.js");
/* harmony import */ var _chunk_1074393c_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunk-1074393c.js */ "./node_modules/@ionic/core/dist/esm/legacy/chunk-1074393c.js");
/* harmony import */ var _chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chunk-d83bfeae.js */ "./node_modules/@ionic/core/dist/esm/legacy/chunk-d83bfeae.js");
/* harmony import */ var _chunk_ba834eff_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chunk-ba834eff.js */ "./node_modules/@ionic/core/dist/esm/legacy/chunk-ba834eff.js");





var ActionSheetController = /** @class */ (function () {
    function ActionSheetController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create an action sheet overlay with action sheet options.
     *
     * @param options The options to use to create the action sheet.
     */
    ActionSheetController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-action-sheet', options);
    };
    /**
     * Dismiss the open action sheet overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the action sheet.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the action sheet.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet.
     */
    ActionSheetController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-action-sheet', id);
    };
    /**
     * Get the most recently opened action sheet overlay.
     */
    ActionSheetController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-action-sheet')];
            });
        });
    };
    return ActionSheetController;
}());
var AlertController = /** @class */ (function () {
    function AlertController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create an alert overlay with alert options.
     *
     * @param options The options to use to create the alert.
     */
    AlertController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-alert', options);
    };
    /**
     * Dismiss the open alert overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the alert.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the alert.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.
     */
    AlertController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-alert', id);
    };
    /**
     * Get the most recently opened alert overlay.
     */
    AlertController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-alert')];
            });
        });
    };
    return AlertController;
}());
/**
 * @deprecated Use `ion-router-link` instead.
 */
var Anchor = /** @class */ (function () {
    function Anchor(hostRef) {
        var _this = this;
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
        /**
         * When using a router, it specifies the transition direction when navigating to
         * another page using `href`.
         */
        this.routerDirection = 'forward';
        this.onClick = function (ev) {
            Object(_chunk_ba834eff_js__WEBPACK_IMPORTED_MODULE_4__["o"])(_this.href, ev, _this.routerDirection);
        };
    }
    Anchor.prototype.componentDidLoad = function () {
        console.warn('The <ion-anchor> component has been deprecated. Please use an <ion-router-link> if you are using a vanilla JS or Stencil project or an <a> with the Angular router.');
    };
    Anchor.prototype.render = function () {
        var _a;
        var mode = Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["c"])(this);
        var attrs = {
            href: this.href,
            rel: this.rel
        };
        return (Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["h"])(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["H"], { onClick: this.onClick, class: Object.assign({}, Object(_chunk_ba834eff_js__WEBPACK_IMPORTED_MODULE_4__["c"])(this.color), (_a = {}, _a[mode] = true, _a['ion-activatable'] = true, _a)) }, Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["h"])("a", Object.assign({}, attrs), Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["h"])("slot", null))));
    };
    Object.defineProperty(Anchor, "style", {
        get: function () { return ":host{--background:transparent;--color:var(--ion-color-primary,#3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}"; },
        enumerable: true,
        configurable: true
    });
    return Anchor;
}());
var LoadingController = /** @class */ (function () {
    function LoadingController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create a loading overlay with loading options.
     *
     * @param options The options to use to create the loading.
     */
    LoadingController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-loading', options);
    };
    /**
     * Dismiss the open loading overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the loading.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the loading.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading.
     */
    LoadingController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-loading', id);
    };
    /**
     * Get the most recently opened loading overlay.
     */
    LoadingController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-loading')];
            });
        });
    };
    return LoadingController;
}());
var ModalController = /** @class */ (function () {
    function ModalController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create a modal overlay with modal options.
     *
     * @param options The options to use to create the modal.
     */
    ModalController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-modal', options);
    };
    /**
     * Dismiss the open modal overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the modal.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the modal.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal.
     */
    ModalController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-modal', id);
    };
    /**
     * Get the most recently opened modal overlay.
     */
    ModalController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-modal')];
            });
        });
    };
    return ModalController;
}());
var PickerController = /** @class */ (function () {
    function PickerController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create a picker overlay with picker options.
     *
     * @param options The options to use to create the picker.
     */
    PickerController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-picker', options);
    };
    /**
     * Dismiss the open picker overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the picker.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the picker.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker.
     */
    PickerController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-picker', id);
    };
    /**
     * Get the most recently opened picker overlay.
     */
    PickerController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-picker')];
            });
        });
    };
    return PickerController;
}());
var PopoverController = /** @class */ (function () {
    function PopoverController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create a popover overlay with popover options.
     *
     * @param options The options to use to create the popover.
     */
    PopoverController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-popover', options);
    };
    /**
     * Dismiss the open popover overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the popover.
     * This can be useful in a button handler for determining which button was
     * clicked to dismiss the popover.
     * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
     * @param id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover.
     */
    PopoverController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-popover', id);
    };
    /**
     * Get the most recently opened popover overlay.
     */
    PopoverController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-popover')];
            });
        });
    };
    return PopoverController;
}());
var ToastController = /** @class */ (function () {
    function ToastController(hostRef) {
        Object(_chunk_09ec7fc0_js__WEBPACK_IMPORTED_MODULE_1__["r"])(this, hostRef);
    }
    /**
     * Create a toast overlay with toast options.
     *
     * @param options The options to use to create the toast.
     */
    ToastController.prototype.create = function (options) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["g"])('ion-toast', options);
    };
    /**
     * Dismiss the open toast overlay.
     *
     * @param data Any data to emit in the dismiss events.
     * @param role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.
     * @param id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast.
     */
    ToastController.prototype.dismiss = function (data, role, id) {
        return Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["h"])(document, data, role, 'ion-toast', id);
    };
    /**
     * Get the most recently opened toast overlay.
     */
    ToastController.prototype.getTop = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                return [2 /*return*/, Object(_chunk_d83bfeae_js__WEBPACK_IMPORTED_MODULE_3__["j"])(document, 'ion-toast')];
            });
        });
    };
    return ToastController;
}());



/***/ })

}]);
//# sourceMappingURL=12.js.map