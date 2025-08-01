"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.UserRole = void 0;
/**
 * Enum for user roles
 */
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["RIDER"] = "RIDER";
    UserRole["DRIVER"] = "DRIVER";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * Enum for account status
 */
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["BLOCKED"] = "BLOCKED";
    AccountStatus["UNBLOCKED"] = "UNBLOCKED";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
