declare const $Export: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly default: "-1";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["funding", "trade"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["type"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly data_url: {
                    readonly type: "string";
                };
            };
            readonly title: "ExportData";
            readonly required: readonly ["code", "data_url"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Account: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["index", "l1_address"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["by", "value"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly total: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly accounts: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly code: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["200"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly message: {
                                readonly type: "string";
                            };
                            readonly account_type: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly cancel_all_time: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly total_order_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly total_isolated_order_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly pending_order_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly available_balance: {
                                readonly type: "string";
                                readonly examples: readonly ["19995"];
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly collateral: {
                                readonly type: "string";
                                readonly examples: readonly ["46342"];
                            };
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly name: {
                                readonly type: "string";
                            };
                            readonly description: {
                                readonly type: "string";
                            };
                            readonly can_invite: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly description: " Remove After FE uses L1 meta endpoint";
                            };
                            readonly referral_points_percentage: {
                                readonly type: "string";
                                readonly description: " Remove After FE uses L1 meta endpoint";
                            };
                            readonly positions: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly market_id: {
                                            readonly type: "integer";
                                            readonly format: "uint8";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: 0;
                                            readonly maximum: 255;
                                        };
                                        readonly symbol: {
                                            readonly type: "string";
                                            readonly examples: readonly ["ETH"];
                                        };
                                        readonly initial_margin_fraction: {
                                            readonly type: "string";
                                            readonly examples: readonly ["20.00"];
                                        };
                                        readonly open_order_count: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["3"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly pending_order_count: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["3"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly position_tied_order_count: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["3"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly sign: {
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly position: {
                                            readonly type: "string";
                                            readonly examples: readonly ["3.6956"];
                                        };
                                        readonly avg_entry_price: {
                                            readonly type: "string";
                                            readonly examples: readonly ["3024.66"];
                                        };
                                        readonly position_value: {
                                            readonly type: "string";
                                            readonly examples: readonly ["3019.92"];
                                        };
                                        readonly unrealized_pnl: {
                                            readonly type: "string";
                                            readonly examples: readonly ["17.521309"];
                                        };
                                        readonly realized_pnl: {
                                            readonly type: "string";
                                            readonly examples: readonly ["2.000000"];
                                        };
                                        readonly liquidation_price: {
                                            readonly type: "string";
                                            readonly examples: readonly ["3024.66"];
                                        };
                                        readonly total_funding_paid_out: {
                                            readonly type: "string";
                                            readonly examples: readonly ["34.2"];
                                        };
                                        readonly margin_mode: {
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly allocated_margin: {
                                            readonly type: "string";
                                            readonly examples: readonly ["46342"];
                                        };
                                    };
                                    readonly title: "AccountPosition";
                                    readonly required: readonly ["market_id", "symbol", "initial_margin_fraction", "open_order_count", "pending_order_count", "position_tied_order_count", "sign", "position", "avg_entry_price", "position_value", "unrealized_pnl", "realized_pnl", "liquidation_price", "margin_mode", "allocated_margin"];
                                };
                            };
                            readonly total_asset_value: {
                                readonly type: "string";
                                readonly examples: readonly ["19995"];
                            };
                            readonly cross_asset_value: {
                                readonly type: "string";
                                readonly examples: readonly ["19995"];
                            };
                            readonly pool_info: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly status: {
                                        readonly type: "integer";
                                        readonly format: "uint8";
                                        readonly examples: readonly ["0"];
                                        readonly minimum: 0;
                                        readonly maximum: 255;
                                    };
                                    readonly operator_fee: {
                                        readonly type: "string";
                                        readonly examples: readonly ["100"];
                                    };
                                    readonly min_operator_share_rate: {
                                        readonly type: "string";
                                        readonly examples: readonly ["200"];
                                    };
                                    readonly total_shares: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly examples: readonly ["100000"];
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly operator_shares: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly examples: readonly ["20000"];
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly annual_percentage_yield: {
                                        readonly type: "number";
                                        readonly format: "double";
                                        readonly examples: readonly ["20.5000"];
                                        readonly minimum: -1.7976931348623157e+308;
                                        readonly maximum: 1.7976931348623157e+308;
                                    };
                                    readonly daily_returns: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly timestamp: {
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly examples: readonly ["1640995200"];
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly daily_return: {
                                                    readonly type: "number";
                                                    readonly format: "double";
                                                    readonly examples: readonly ["0.0001"];
                                                    readonly minimum: -1.7976931348623157e+308;
                                                    readonly maximum: 1.7976931348623157e+308;
                                                };
                                            };
                                            readonly title: "DailyReturn";
                                            readonly required: readonly ["timestamp", "daily_return"];
                                        };
                                    };
                                    readonly share_prices: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly timestamp: {
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly examples: readonly ["1640995200"];
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly share_price: {
                                                    readonly type: "number";
                                                    readonly format: "double";
                                                    readonly examples: readonly ["0.0001"];
                                                    readonly minimum: -1.7976931348623157e+308;
                                                    readonly maximum: 1.7976931348623157e+308;
                                                };
                                            };
                                            readonly title: "SharePrice";
                                            readonly required: readonly ["timestamp", "share_price"];
                                        };
                                    };
                                };
                                readonly title: "PublicPoolInfo";
                                readonly required: readonly ["status", "operator_fee", "min_operator_share_rate", "total_shares", "operator_shares", "annual_percentage_yield", "daily_returns", "share_prices"];
                            };
                            readonly shares: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly public_pool_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly shares_amount: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["3000"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly entry_usdc: {
                                            readonly type: "string";
                                            readonly examples: readonly ["3000"];
                                        };
                                    };
                                    readonly title: "PublicPoolShare";
                                    readonly required: readonly ["public_pool_index", "shares_amount", "entry_usdc"];
                                };
                            };
                        };
                        readonly title: "DetailedAccount";
                        readonly required: readonly ["code", "account_type", "index", "l1_address", "cancel_all_time", "total_order_count", "total_isolated_order_count", "pending_order_count", "available_balance", "status", "collateral", "account_index", "name", "description", "can_invite", "referral_points_percentage", "positions", "total_asset_value", "cross_asset_value", "pool_info", "shares"];
                    };
                };
            };
            readonly title: "DetailedAccounts";
            readonly required: readonly ["code", "total", "accounts"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AccountActiveOrders: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
            };
            readonly required: readonly ["account_index", "market_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly next_cursor: {
                    readonly type: "string";
                };
                readonly orders: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly client_order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["234"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly client_order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["234"];
                            };
                            readonly market_index: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly owner_account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly initial_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly nonce: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["722"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly remaining_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly is_ask: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly base_size: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["12354"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly base_price: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["3024"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly filled_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly filled_quote_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly side: {
                                readonly type: "string";
                                readonly default: "buy";
                                readonly description: " TODO: remove this";
                                readonly examples: readonly ["buy"];
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["limit", "market", "stop-loss", "stop-loss-limit", "take-profit", "take-profit-limit", "twap", "twap-sub", "liquidation"];
                                readonly examples: readonly ["limit"];
                                readonly description: "`limit` `market` `stop-loss` `stop-loss-limit` `take-profit` `take-profit-limit` `twap` `twap-sub` `liquidation`";
                            };
                            readonly time_in_force: {
                                readonly type: "string";
                                readonly enum: readonly ["good-till-time", "immediate-or-cancel", "post-only", "Unknown"];
                                readonly default: "good-till-time";
                                readonly description: "`good-till-time` `immediate-or-cancel` `post-only` `Unknown`";
                            };
                            readonly reduce_only: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly trigger_price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly order_expiry: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["in-progress", "pending", "open", "filled", "canceled", "canceled-post-only", "canceled-reduce-only", "canceled-position-not-allowed", "canceled-margin-not-allowed", "canceled-too-much-slippage", "canceled-not-enough-liquidity", "canceled-self-trade", "canceled-expired", "canceled-oco", "canceled-child", "canceled-liquidation"];
                                readonly examples: readonly ["open"];
                                readonly description: "`in-progress` `pending` `open` `filled` `canceled` `canceled-post-only` `canceled-reduce-only` `canceled-position-not-allowed` `canceled-margin-not-allowed` `canceled-too-much-slippage` `canceled-not-enough-liquidity` `canceled-self-trade` `canceled-expired` `canceled-oco` `canceled-child` `canceled-liquidation`";
                            };
                            readonly trigger_status: {
                                readonly type: "string";
                                readonly enum: readonly ["na", "ready", "mark-price", "twap", "parent-order"];
                                readonly examples: readonly ["twap"];
                                readonly description: "`na` `ready` `mark-price` `twap` `parent-order`";
                            };
                            readonly trigger_time: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly to_trigger_order_id_0: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly to_trigger_order_id_1: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly to_cancel_order_id_0: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly created_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly updated_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "Order";
                        readonly required: readonly ["order_index", "client_order_index", "order_id", "client_order_id", "market_index", "owner_account_index", "initial_base_amount", "price", "nonce", "remaining_base_amount", "is_ask", "base_size", "base_price", "filled_base_amount", "filled_quote_amount", "side", "type", "time_in_force", "reduce_only", "trigger_price", "order_expiry", "status", "trigger_status", "trigger_time", "parent_order_index", "parent_order_id", "to_trigger_order_id_0", "to_trigger_order_id_1", "to_cancel_order_id_0", "block_height", "timestamp", "created_at", "updated_at"];
                    };
                };
            };
            readonly title: "Orders";
            readonly required: readonly ["code", "orders"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AccountInactiveOrders: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly ask_filter: {
                    readonly type: "integer";
                    readonly format: "int8";
                    readonly default: "-1";
                    readonly minimum: -128;
                    readonly maximum: 127;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly between_timestamps: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index", "limit"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly next_cursor: {
                    readonly type: "string";
                };
                readonly orders: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly client_order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["234"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly client_order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["234"];
                            };
                            readonly market_index: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly owner_account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly initial_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly nonce: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["722"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly remaining_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly is_ask: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly base_size: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["12354"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly base_price: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["3024"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly filled_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly filled_quote_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly side: {
                                readonly type: "string";
                                readonly default: "buy";
                                readonly description: " TODO: remove this";
                                readonly examples: readonly ["buy"];
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["limit", "market", "stop-loss", "stop-loss-limit", "take-profit", "take-profit-limit", "twap", "twap-sub", "liquidation"];
                                readonly examples: readonly ["limit"];
                                readonly description: "`limit` `market` `stop-loss` `stop-loss-limit` `take-profit` `take-profit-limit` `twap` `twap-sub` `liquidation`";
                            };
                            readonly time_in_force: {
                                readonly type: "string";
                                readonly enum: readonly ["good-till-time", "immediate-or-cancel", "post-only", "Unknown"];
                                readonly default: "good-till-time";
                                readonly description: "`good-till-time` `immediate-or-cancel` `post-only` `Unknown`";
                            };
                            readonly reduce_only: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly trigger_price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly order_expiry: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["in-progress", "pending", "open", "filled", "canceled", "canceled-post-only", "canceled-reduce-only", "canceled-position-not-allowed", "canceled-margin-not-allowed", "canceled-too-much-slippage", "canceled-not-enough-liquidity", "canceled-self-trade", "canceled-expired", "canceled-oco", "canceled-child", "canceled-liquidation"];
                                readonly examples: readonly ["open"];
                                readonly description: "`in-progress` `pending` `open` `filled` `canceled` `canceled-post-only` `canceled-reduce-only` `canceled-position-not-allowed` `canceled-margin-not-allowed` `canceled-too-much-slippage` `canceled-not-enough-liquidity` `canceled-self-trade` `canceled-expired` `canceled-oco` `canceled-child` `canceled-liquidation`";
                            };
                            readonly trigger_status: {
                                readonly type: "string";
                                readonly enum: readonly ["na", "ready", "mark-price", "twap", "parent-order"];
                                readonly examples: readonly ["twap"];
                                readonly description: "`na` `ready` `mark-price` `twap` `parent-order`";
                            };
                            readonly trigger_time: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly to_trigger_order_id_0: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly to_trigger_order_id_1: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly to_cancel_order_id_0: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly created_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly updated_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "Order";
                        readonly required: readonly ["order_index", "client_order_index", "order_id", "client_order_id", "market_index", "owner_account_index", "initial_base_amount", "price", "nonce", "remaining_base_amount", "is_ask", "base_size", "base_price", "filled_base_amount", "filled_quote_amount", "side", "type", "time_in_force", "reduce_only", "trigger_price", "order_expiry", "status", "trigger_status", "trigger_time", "parent_order_index", "parent_order_id", "to_trigger_order_id_0", "to_trigger_order_id_1", "to_cancel_order_id_0", "block_height", "timestamp", "created_at", "updated_at"];
                    };
                };
            };
            readonly title: "Orders";
            readonly required: readonly ["code", "orders"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AccountLimits: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
            };
            readonly required: readonly ["account_index"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly max_llp_percentage: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["25"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly user_tier: {
                    readonly type: "string";
                    readonly examples: readonly ["std"];
                };
                readonly can_create_public_pool: {
                    readonly type: "boolean";
                    readonly format: "boolean";
                    readonly examples: readonly ["true"];
                };
            };
            readonly title: "AccountLimits";
            readonly required: readonly ["code", "max_llp_percentage", "user_tier", "can_create_public_pool"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AccountMetadata: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["index", "l1_address"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["by", "value"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly account_metadatas: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly name: {
                                readonly type: "string";
                            };
                            readonly description: {
                                readonly type: "string";
                            };
                            readonly can_invite: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly description: " Remove After FE uses L1 meta endpoint";
                            };
                            readonly referral_points_percentage: {
                                readonly type: "string";
                                readonly description: " Remove After FE uses L1 meta endpoint";
                            };
                        };
                        readonly title: "AccountMetadata";
                        readonly required: readonly ["account_index", "name", "description", "can_invite", "referral_points_percentage"];
                    };
                };
            };
            readonly title: "AccountMetadatas";
            readonly required: readonly ["code", "account_metadatas"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AccountTxs: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["account_index"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly types: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "integer";
                        readonly format: "uint8";
                        readonly minimum: 0;
                        readonly maximum: 255;
                    };
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["limit", "by", "value"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly txs: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly type: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly maximum: 64;
                                readonly minimum: 1;
                                readonly examples: readonly ["1"];
                            };
                            readonly info: {
                                readonly type: "string";
                                readonly examples: readonly ["{}"];
                            };
                            readonly event_info: {
                                readonly type: "string";
                                readonly examples: readonly ["{}"];
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly transaction_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["8761"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly nonce: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["722"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly expire_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly queued_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly executed_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly sequence_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["8761"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                        };
                        readonly title: "Tx";
                        readonly required: readonly ["hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash"];
                    };
                };
            };
            readonly title: "Txs";
            readonly required: readonly ["code", "txs"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AccountsByL1Address: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly l1_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["l1_address"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly l1_address: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly sub_accounts: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly code: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["200"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly message: {
                                readonly type: "string";
                            };
                            readonly account_type: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly cancel_all_time: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly total_order_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly total_isolated_order_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly pending_order_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly available_balance: {
                                readonly type: "string";
                                readonly examples: readonly ["19995"];
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly collateral: {
                                readonly type: "string";
                                readonly examples: readonly ["46342"];
                            };
                        };
                        readonly title: "Account";
                        readonly required: readonly ["code", "account_type", "index", "l1_address", "cancel_all_time", "total_order_count", "total_isolated_order_count", "pending_order_count", "available_balance", "status", "collateral"];
                    };
                    readonly examples: readonly ["1"];
                };
            };
            readonly title: "SubAccounts";
            readonly required: readonly ["code", "l1_address", "sub_accounts"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Announcement: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly announcements: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly title: {
                                readonly type: "string";
                            };
                            readonly content: {
                                readonly type: "string";
                            };
                            readonly created_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "Announcement";
                        readonly required: readonly ["title", "content", "created_at"];
                    };
                };
            };
            readonly title: "Announcements";
            readonly required: readonly ["code", "announcements"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Apikeys: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly api_key_index: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly api_keys: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["3"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly api_key_index: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["0"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly nonce: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["722"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly public_key: {
                                readonly type: "string";
                            };
                        };
                        readonly title: "ApiKey";
                        readonly required: readonly ["account_index", "api_key_index", "nonce", "public_key"];
                    };
                };
            };
            readonly title: "AccountApiKeys";
            readonly required: readonly ["code", "api_keys"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Block: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["commitment", "height"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["by", "value"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly total: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly blocks: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly commitment: {
                                readonly type: "string";
                            };
                            readonly height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly state_root: {
                                readonly type: "string";
                            };
                            readonly priority_operations: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly on_chain_l2_operations: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly pending_on_chain_operations_pub_data: {
                                readonly type: "string";
                            };
                            readonly committed_tx_hash: {
                                readonly type: "string";
                            };
                            readonly committed_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly verified_tx_hash: {
                                readonly type: "string";
                            };
                            readonly verified_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly txs: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly hash: {
                                            readonly type: "string";
                                            readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                                        };
                                        readonly type: {
                                            readonly type: "integer";
                                            readonly format: "uint8";
                                            readonly maximum: 64;
                                            readonly minimum: 1;
                                            readonly examples: readonly ["1"];
                                        };
                                        readonly info: {
                                            readonly type: "string";
                                            readonly examples: readonly ["{}"];
                                        };
                                        readonly event_info: {
                                            readonly type: "string";
                                            readonly examples: readonly ["{}"];
                                        };
                                        readonly status: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly transaction_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["8761"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly l1_address: {
                                            readonly type: "string";
                                            readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                                        };
                                        readonly account_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly nonce: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["722"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly expire_at: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1640995200"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly block_height: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["45434"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly queued_at: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1640995200"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly executed_at: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1640995200"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly sequence_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["8761"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly parent_hash: {
                                            readonly type: "string";
                                            readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                                        };
                                    };
                                    readonly title: "Tx";
                                    readonly required: readonly ["hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash"];
                                };
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly size: {
                                readonly type: "integer";
                                readonly format: "uin16";
                            };
                        };
                        readonly title: "Block";
                        readonly required: readonly ["commitment", "height", "state_root", "priority_operations", "on_chain_l2_operations", "pending_on_chain_operations_pub_data", "committed_tx_hash", "committed_at", "verified_tx_hash", "verified_at", "txs", "status", "size"];
                    };
                };
            };
            readonly title: "Blocks";
            readonly required: readonly ["code", "total", "blocks"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const BlockTxs: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["block_height", "block_commitment"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["by", "value"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly txs: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly type: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly maximum: 64;
                                readonly minimum: 1;
                                readonly examples: readonly ["1"];
                            };
                            readonly info: {
                                readonly type: "string";
                                readonly examples: readonly ["{}"];
                            };
                            readonly event_info: {
                                readonly type: "string";
                                readonly examples: readonly ["{}"];
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly transaction_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["8761"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly nonce: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["722"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly expire_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly queued_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly executed_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly sequence_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["8761"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                        };
                        readonly title: "Tx";
                        readonly required: readonly ["hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash"];
                    };
                };
            };
            readonly title: "Txs";
            readonly required: readonly ["code", "txs"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Blocks: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly enum: readonly ["asc", "desc"];
                    readonly default: "asc";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["limit"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly total: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly blocks: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly commitment: {
                                readonly type: "string";
                            };
                            readonly height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly state_root: {
                                readonly type: "string";
                            };
                            readonly priority_operations: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly on_chain_l2_operations: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly pending_on_chain_operations_pub_data: {
                                readonly type: "string";
                            };
                            readonly committed_tx_hash: {
                                readonly type: "string";
                            };
                            readonly committed_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly verified_tx_hash: {
                                readonly type: "string";
                            };
                            readonly verified_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly txs: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly hash: {
                                            readonly type: "string";
                                            readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                                        };
                                        readonly type: {
                                            readonly type: "integer";
                                            readonly format: "uint8";
                                            readonly maximum: 64;
                                            readonly minimum: 1;
                                            readonly examples: readonly ["1"];
                                        };
                                        readonly info: {
                                            readonly type: "string";
                                            readonly examples: readonly ["{}"];
                                        };
                                        readonly event_info: {
                                            readonly type: "string";
                                            readonly examples: readonly ["{}"];
                                        };
                                        readonly status: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly transaction_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["8761"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly l1_address: {
                                            readonly type: "string";
                                            readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                                        };
                                        readonly account_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly nonce: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["722"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly expire_at: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1640995200"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly block_height: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["45434"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly queued_at: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1640995200"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly executed_at: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["1640995200"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly sequence_index: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly examples: readonly ["8761"];
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly parent_hash: {
                                            readonly type: "string";
                                            readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                                        };
                                    };
                                    readonly title: "Tx";
                                    readonly required: readonly ["hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash"];
                                };
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly size: {
                                readonly type: "integer";
                                readonly format: "uin16";
                            };
                        };
                        readonly title: "Block";
                        readonly required: readonly ["commitment", "height", "state_root", "priority_operations", "on_chain_l2_operations", "pending_on_chain_operations_pub_data", "committed_tx_hash", "committed_at", "verified_tx_hash", "verified_at", "txs", "status", "size"];
                    };
                };
            };
            readonly title: "Blocks";
            readonly required: readonly ["code", "total", "blocks"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Candlesticks: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly resolution: {
                    readonly type: "string";
                    readonly enum: readonly ["1m", "5m", "15m", "30m", "1h", "4h", "12h", "1d", "1w"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly start_timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 0;
                    readonly maximum: 5000000000000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly end_timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 0;
                    readonly maximum: 5000000000000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly count_back: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly set_timestamp_to_end: {
                    readonly type: "boolean";
                    readonly format: "boolean";
                    readonly default: "false";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["market_id", "resolution", "start_timestamp", "end_timestamp", "count_back"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly resolution: {
                    readonly type: "string";
                    readonly examples: readonly ["15m"];
                };
                readonly candlesticks: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly open: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3024.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly high: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3034.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly low: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3014.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly close: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3024.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly volume0: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["235.25"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly volume1: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["93566.25"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly last_trade_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "Candlestick";
                        readonly required: readonly ["timestamp", "open", "high", "low", "close", "volume0", "volume1", "last_trade_id"];
                    };
                };
            };
            readonly title: "Candlesticks";
            readonly required: readonly ["code", "resolution", "candlesticks"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ChangeAccountTier: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly auth: {
                readonly type: "string";
                readonly description: " made optional to support header auth clients";
            };
            readonly account_index: {
                readonly type: "integer";
                readonly format: "int64";
                readonly minimum: -9223372036854776000;
                readonly maximum: 9223372036854776000;
            };
            readonly new_tier: {
                readonly type: "string";
            };
        };
        readonly title: "ReqChangeAccountTier";
        readonly required: readonly ["account_index", "new_tier"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "RespChangeAccountTier";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const CurrentHeight: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly height: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "CurrentHeight";
            readonly required: readonly ["code", "height"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const DepositHistory: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly l1_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly filter: {
                    readonly type: "string";
                    readonly enum: readonly ["all", "pending", "claimable"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index", "l1_address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly deposits: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["failed", "pending", "completed", "claimable"];
                                readonly description: "`failed` `pending` `completed` `claimable`";
                            };
                            readonly l1_tx_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                        };
                        readonly title: "DepositHistoryItem";
                        readonly required: readonly ["id", "amount", "timestamp", "status", "l1_tx_hash"];
                    };
                };
                readonly cursor: {
                    readonly type: "string";
                };
            };
            readonly title: "DepositHistory";
            readonly required: readonly ["code", "deposits", "cursor"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ExchangeStats: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly total: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly order_book_stats: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly symbol: {
                                readonly type: "string";
                                readonly examples: readonly ["ETH"];
                            };
                            readonly last_trade_price: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3024.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_trades_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["68"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly daily_base_token_volume: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["235.25"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_quote_token_volume: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["93566.25"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_price_change: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                        };
                        readonly title: "OrderBookStats";
                        readonly required: readonly ["symbol", "last_trade_price", "daily_trades_count", "daily_base_token_volume", "daily_quote_token_volume", "daily_price_change"];
                    };
                    readonly examples: readonly ["1"];
                };
                readonly daily_usd_volume: {
                    readonly type: "number";
                    readonly format: "double";
                    readonly examples: readonly ["93566.25"];
                    readonly minimum: -1.7976931348623157e+308;
                    readonly maximum: 1.7976931348623157e+308;
                };
                readonly daily_trades_count: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["68"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "ExchangeStats";
            readonly required: readonly ["code", "total", "order_book_stats", "daily_usd_volume", "daily_trades_count"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const FastbridgeInfo: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly fast_bridge_limit: {
                    readonly type: "string";
                };
            };
            readonly title: "RespGetFastBridgeInfo";
            readonly required: readonly ["code", "fast_bridge_limit"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const FundingRates: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly funding_rates: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly exchange: {
                                readonly type: "string";
                                readonly enum: readonly ["binance", "bybit", "hyperliquid", "lighter"];
                                readonly description: "`binance` `bybit` `hyperliquid` `lighter`";
                            };
                            readonly symbol: {
                                readonly type: "string";
                            };
                            readonly rate: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                        };
                        readonly title: "FundingRate";
                        readonly required: readonly ["market_id", "exchange", "symbol", "rate"];
                    };
                };
            };
            readonly title: "FundingRates";
            readonly required: readonly ["code", "funding_rates"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Fundings: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly resolution: {
                    readonly type: "string";
                    readonly enum: readonly ["1h", "1d"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly start_timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 0;
                    readonly maximum: 5000000000000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly end_timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 0;
                    readonly maximum: 5000000000000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly count_back: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["market_id", "resolution", "start_timestamp", "end_timestamp", "count_back"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly resolution: {
                    readonly type: "string";
                    readonly examples: readonly ["1h"];
                };
                readonly fundings: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly examples: readonly ["0.0001"];
                            };
                            readonly rate: {
                                readonly type: "string";
                                readonly examples: readonly ["0.0001"];
                            };
                            readonly direction: {
                                readonly type: "string";
                                readonly examples: readonly ["long"];
                            };
                        };
                        readonly title: "Funding";
                        readonly required: readonly ["timestamp", "value", "rate", "direction"];
                    };
                };
            };
            readonly title: "Fundings";
            readonly required: readonly ["code", "resolution", "fundings"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Info: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly contract_address: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
            };
            readonly title: "ZkLighterInfo";
            readonly required: readonly ["contract_address"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const L1Metadata: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly l1_address: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["l1_address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly l1_address: {
                    readonly type: "string";
                };
                readonly can_invite: {
                    readonly type: "boolean";
                    readonly format: "boolean";
                };
                readonly referral_points_percentage: {
                    readonly type: "string";
                };
            };
            readonly title: "L1Metadata";
            readonly required: readonly ["l1_address", "can_invite", "referral_points_percentage"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Liquidations: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index", "limit"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly liquidations: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["partial", "deleverage"];
                                readonly description: "`partial` `deleverage`";
                            };
                            readonly trade: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly price: {
                                        readonly type: "string";
                                    };
                                    readonly size: {
                                        readonly type: "string";
                                    };
                                    readonly taker_fee: {
                                        readonly type: "string";
                                    };
                                    readonly maker_fee: {
                                        readonly type: "string";
                                    };
                                };
                                readonly title: "LiqTrade";
                                readonly required: readonly ["price", "size", "taker_fee", "maker_fee"];
                            };
                            readonly info: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly positions: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly market_id: {
                                                    readonly type: "integer";
                                                    readonly format: "uint8";
                                                    readonly examples: readonly ["1"];
                                                    readonly minimum: 0;
                                                    readonly maximum: 255;
                                                };
                                                readonly symbol: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["ETH"];
                                                };
                                                readonly initial_margin_fraction: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["20.00"];
                                                };
                                                readonly open_order_count: {
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly examples: readonly ["3"];
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly pending_order_count: {
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly examples: readonly ["3"];
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly position_tied_order_count: {
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly examples: readonly ["3"];
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly sign: {
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly examples: readonly ["1"];
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly position: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["3.6956"];
                                                };
                                                readonly avg_entry_price: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["3024.66"];
                                                };
                                                readonly position_value: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["3019.92"];
                                                };
                                                readonly unrealized_pnl: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["17.521309"];
                                                };
                                                readonly realized_pnl: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["2.000000"];
                                                };
                                                readonly liquidation_price: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["3024.66"];
                                                };
                                                readonly total_funding_paid_out: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["34.2"];
                                                };
                                                readonly margin_mode: {
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly examples: readonly ["1"];
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly allocated_margin: {
                                                    readonly type: "string";
                                                    readonly examples: readonly ["46342"];
                                                };
                                            };
                                            readonly title: "AccountPosition";
                                            readonly required: readonly ["market_id", "symbol", "initial_margin_fraction", "open_order_count", "pending_order_count", "position_tied_order_count", "sign", "position", "avg_entry_price", "position_value", "unrealized_pnl", "realized_pnl", "liquidation_price", "margin_mode", "allocated_margin"];
                                        };
                                    };
                                    readonly risk_info_before: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly cross_risk_parameters: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly market_id: {
                                                        readonly type: "integer";
                                                        readonly format: "uint8";
                                                        readonly minimum: 0;
                                                        readonly maximum: 255;
                                                    };
                                                    readonly collateral: {
                                                        readonly type: "string";
                                                    };
                                                    readonly total_account_value: {
                                                        readonly type: "string";
                                                    };
                                                    readonly initial_margin_req: {
                                                        readonly type: "string";
                                                    };
                                                    readonly maintenance_margin_req: {
                                                        readonly type: "string";
                                                    };
                                                    readonly close_out_margin_req: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly title: "RiskParameters";
                                                readonly required: readonly ["market_id", "collateral", "total_account_value", "initial_margin_req", "maintenance_margin_req", "close_out_margin_req"];
                                            };
                                            readonly isolated_risk_parameters: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly market_id: {
                                                            readonly type: "integer";
                                                            readonly format: "uint8";
                                                            readonly minimum: 0;
                                                            readonly maximum: 255;
                                                        };
                                                        readonly collateral: {
                                                            readonly type: "string";
                                                        };
                                                        readonly total_account_value: {
                                                            readonly type: "string";
                                                        };
                                                        readonly initial_margin_req: {
                                                            readonly type: "string";
                                                        };
                                                        readonly maintenance_margin_req: {
                                                            readonly type: "string";
                                                        };
                                                        readonly close_out_margin_req: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly title: "RiskParameters";
                                                    readonly required: readonly ["market_id", "collateral", "total_account_value", "initial_margin_req", "maintenance_margin_req", "close_out_margin_req"];
                                                };
                                            };
                                        };
                                        readonly title: "RiskInfo";
                                        readonly required: readonly ["cross_risk_parameters", "isolated_risk_parameters"];
                                    };
                                    readonly risk_info_after: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly cross_risk_parameters: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly market_id: {
                                                        readonly type: "integer";
                                                        readonly format: "uint8";
                                                        readonly minimum: 0;
                                                        readonly maximum: 255;
                                                    };
                                                    readonly collateral: {
                                                        readonly type: "string";
                                                    };
                                                    readonly total_account_value: {
                                                        readonly type: "string";
                                                    };
                                                    readonly initial_margin_req: {
                                                        readonly type: "string";
                                                    };
                                                    readonly maintenance_margin_req: {
                                                        readonly type: "string";
                                                    };
                                                    readonly close_out_margin_req: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly title: "RiskParameters";
                                                readonly required: readonly ["market_id", "collateral", "total_account_value", "initial_margin_req", "maintenance_margin_req", "close_out_margin_req"];
                                            };
                                            readonly isolated_risk_parameters: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly properties: {
                                                        readonly market_id: {
                                                            readonly type: "integer";
                                                            readonly format: "uint8";
                                                            readonly minimum: 0;
                                                            readonly maximum: 255;
                                                        };
                                                        readonly collateral: {
                                                            readonly type: "string";
                                                        };
                                                        readonly total_account_value: {
                                                            readonly type: "string";
                                                        };
                                                        readonly initial_margin_req: {
                                                            readonly type: "string";
                                                        };
                                                        readonly maintenance_margin_req: {
                                                            readonly type: "string";
                                                        };
                                                        readonly close_out_margin_req: {
                                                            readonly type: "string";
                                                        };
                                                    };
                                                    readonly title: "RiskParameters";
                                                    readonly required: readonly ["market_id", "collateral", "total_account_value", "initial_margin_req", "maintenance_margin_req", "close_out_margin_req"];
                                                };
                                            };
                                        };
                                        readonly title: "RiskInfo";
                                        readonly required: readonly ["cross_risk_parameters", "isolated_risk_parameters"];
                                    };
                                    readonly mark_prices: {
                                        readonly type: "object";
                                        readonly additionalProperties: {
                                            readonly type: "number";
                                            readonly format: "double";
                                            readonly minimum: -1.7976931348623157e+308;
                                            readonly maximum: 1.7976931348623157e+308;
                                        };
                                    };
                                };
                                readonly title: "LiquidationInfo";
                                readonly required: readonly ["positions", "risk_info_before", "risk_info_after", "mark_prices"];
                            };
                            readonly executed_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "Liquidation";
                        readonly required: readonly ["id", "market_id", "type", "trade", "info", "executed_at"];
                    };
                };
                readonly next_cursor: {
                    readonly type: "string";
                };
            };
            readonly title: "LiquidationInfos";
            readonly required: readonly ["code", "liquidations"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const NextNonce: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly api_key_index: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index", "api_key_index"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly nonce: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["722"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "NextNonce";
            readonly required: readonly ["code", "nonce"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const NotificationAck: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly notif_id: {
                readonly type: "string";
                readonly examples: readonly ["'liq:17:5898'"];
            };
            readonly auth: {
                readonly type: "string";
                readonly description: " made optional to support header auth clients";
            };
            readonly account_index: {
                readonly type: "integer";
                readonly format: "int64";
                readonly minimum: -9223372036854776000;
                readonly maximum: 9223372036854776000;
            };
        };
        readonly title: "ReqAckNotif";
        readonly required: readonly ["notif_id", "account_index"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const OrderBookDetails: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly order_book_details: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly symbol: {
                                readonly type: "string";
                                readonly examples: readonly ["ETH"];
                            };
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["inactive", "active"];
                                readonly examples: readonly ["active"];
                                readonly description: "`inactive` `active`";
                            };
                            readonly taker_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["0.0001"];
                            };
                            readonly maker_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["0.0000"];
                            };
                            readonly liquidation_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["0.01"];
                            };
                            readonly min_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.01"];
                            };
                            readonly min_quote_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly supported_size_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly supported_price_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly supported_quote_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly size_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly price_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly quote_multiplier: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["10000"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly default_initial_margin_fraction: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["100"];
                            };
                            readonly min_initial_margin_fraction: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["100"];
                            };
                            readonly maintenance_margin_fraction: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["50"];
                            };
                            readonly closeout_margin_fraction: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["100"];
                            };
                            readonly last_trade_price: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3024.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_trades_count: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["68"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly daily_base_token_volume: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["235.25"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_quote_token_volume: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["93566.25"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_price_low: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3014.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_price_high: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3024.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_price_change: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["3.66"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly open_interest: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["93.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly daily_chart: {
                                readonly type: "object";
                                readonly additionalProperties: {
                                    readonly type: "number";
                                    readonly format: "double";
                                    readonly minimum: -1.7976931348623157e+308;
                                    readonly maximum: 1.7976931348623157e+308;
                                };
                                readonly examples: readonly ["{1640995200:3024.66}"];
                            };
                        };
                        readonly title: "OrderBookDetail";
                        readonly required: readonly ["symbol", "market_id", "status", "taker_fee", "maker_fee", "liquidation_fee", "min_base_amount", "min_quote_amount", "supported_size_decimals", "supported_price_decimals", "supported_quote_decimals", "size_decimals", "price_decimals", "quote_multiplier", "default_initial_margin_fraction", "min_initial_margin_fraction", "maintenance_margin_fraction", "closeout_margin_fraction", "last_trade_price", "daily_trades_count", "daily_base_token_volume", "daily_quote_token_volume", "daily_price_low", "daily_price_high", "daily_price_change", "open_interest", "daily_chart"];
                    };
                };
            };
            readonly title: "OrderBookDetails";
            readonly required: readonly ["code", "order_book_details"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const OrderBookOrders: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["market_id", "limit"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly total_asks: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly asks: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly owner_account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly initial_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly remaining_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly order_expiry: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "SimpleOrder";
                        readonly required: readonly ["order_index", "order_id", "owner_account_index", "initial_base_amount", "remaining_base_amount", "price", "order_expiry"];
                    };
                };
                readonly total_bids: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly bids: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly order_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly order_id: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly owner_account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly initial_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly remaining_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly order_expiry: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                        };
                        readonly title: "SimpleOrder";
                        readonly required: readonly ["order_index", "order_id", "owner_account_index", "initial_base_amount", "remaining_base_amount", "price", "order_expiry"];
                    };
                };
            };
            readonly title: "OrderBookOrders";
            readonly required: readonly ["code", "total_asks", "asks", "total_bids", "bids"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const OrderBooks: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly order_books: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly symbol: {
                                readonly type: "string";
                                readonly examples: readonly ["ETH"];
                            };
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["inactive", "active"];
                                readonly examples: readonly ["active"];
                                readonly description: "`inactive` `active`";
                            };
                            readonly taker_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["0.0001"];
                            };
                            readonly maker_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["0.0000"];
                            };
                            readonly liquidation_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["0.01"];
                            };
                            readonly min_base_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.01"];
                            };
                            readonly min_quote_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly supported_size_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly supported_price_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly supported_quote_decimals: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["4"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                        };
                        readonly title: "OrderBook";
                        readonly required: readonly ["symbol", "market_id", "status", "taker_fee", "maker_fee", "liquidation_fee", "min_base_amount", "min_quote_amount", "supported_size_decimals", "supported_price_decimals", "supported_quote_decimals"];
                    };
                };
            };
            readonly title: "OrderBooks";
            readonly required: readonly ["code", "order_books"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Pnl: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["index"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly resolution: {
                    readonly type: "string";
                    readonly enum: readonly ["1m", "5m", "15m", "1h", "4h", "1d"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly start_timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 0;
                    readonly maximum: 5000000000000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly end_timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 0;
                    readonly maximum: 5000000000000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly count_back: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly ignore_transfers: {
                    readonly type: "boolean";
                    readonly format: "boolean";
                    readonly default: "false";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["by", "value", "resolution", "start_timestamp", "end_timestamp", "count_back"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly resolution: {
                    readonly type: "string";
                    readonly examples: readonly ["15m"];
                };
                readonly pnl: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly trade_pnl: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly inflow: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly outflow: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly pool_pnl: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly pool_inflow: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly pool_outflow: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly pool_total_shares: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["12.0"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                        };
                        readonly title: "PnLEntry";
                        readonly required: readonly ["timestamp", "trade_pnl", "inflow", "outflow", "pool_pnl", "pool_inflow", "pool_outflow", "pool_total_shares"];
                    };
                };
            };
            readonly title: "AccountPnL";
            readonly required: readonly ["code", "resolution", "pnl"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PositionFunding: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly side: {
                    readonly type: "string";
                    readonly enum: readonly ["long", "short", "all"];
                    readonly default: "all";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index", "limit"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly position_fundings: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly funding_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly change: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly rate: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly position_size: {
                                readonly type: "string";
                                readonly examples: readonly ["1"];
                            };
                            readonly position_side: {
                                readonly type: "string";
                                readonly enum: readonly ["long", "short"];
                                readonly examples: readonly ["long"];
                                readonly description: "`long` `short`";
                            };
                        };
                        readonly title: "PositionFunding";
                        readonly required: readonly ["timestamp", "market_id", "funding_id", "change", "rate", "position_size", "position_side"];
                    };
                };
                readonly next_cursor: {
                    readonly type: "string";
                };
            };
            readonly title: "PositionFundings";
            readonly required: readonly ["code", "position_fundings"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PublicPoolsMetadata: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly filter: {
                    readonly type: "string";
                    readonly enum: readonly ["all", "user", "protocol", "account_index"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["index", "limit"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly public_pools: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly code: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["200"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly message: {
                                readonly type: "string";
                            };
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["3"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly account_type: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly name: {
                                readonly type: "string";
                            };
                            readonly l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly annual_percentage_yield: {
                                readonly type: "number";
                                readonly format: "double";
                                readonly examples: readonly ["20.5000"];
                                readonly minimum: -1.7976931348623157e+308;
                                readonly maximum: 1.7976931348623157e+308;
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["0"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly operator_fee: {
                                readonly type: "string";
                                readonly examples: readonly ["100"];
                            };
                            readonly total_asset_value: {
                                readonly type: "string";
                                readonly examples: readonly ["19995"];
                            };
                            readonly total_shares: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["100000"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly account_share: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly public_pool_index: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly examples: readonly ["1"];
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly shares_amount: {
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly examples: readonly ["3000"];
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly entry_usdc: {
                                        readonly type: "string";
                                        readonly examples: readonly ["3000"];
                                    };
                                };
                                readonly title: "PublicPoolShare";
                                readonly required: readonly ["public_pool_index", "shares_amount", "entry_usdc"];
                            };
                        };
                        readonly title: "PublicPoolMetadata";
                        readonly required: readonly ["code", "account_index", "account_type", "name", "l1_address", "annual_percentage_yield", "status", "operator_fee", "total_asset_value", "total_shares"];
                    };
                };
            };
            readonly title: "RespPublicPoolsMetadata";
            readonly required: readonly ["code", "public_pools"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const RecentTrades: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["market_id", "limit"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly next_cursor: {
                    readonly type: "string";
                };
                readonly trades: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly trade_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["145"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly tx_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["trade", "liquidation", "deleverage"];
                                readonly examples: readonly ["trade"];
                                readonly description: "`trade` `liquidation` `deleverage`";
                            };
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly size: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly usd_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly ask_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["145"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly bid_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["245"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly ask_account_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly bid_account_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["3"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly is_maker_ask: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly taker_fee: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["0"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly taker_position_size_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly taker_entry_quote_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly taker_initial_margin_fraction_before: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["0"];
                            };
                            readonly taker_position_sign_changed: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly maker_fee: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["0"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly maker_position_size_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly maker_entry_quote_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly maker_initial_margin_fraction_before: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["0"];
                            };
                            readonly maker_position_sign_changed: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                        };
                        readonly title: "Trade";
                        readonly required: readonly ["trade_id", "tx_hash", "type", "market_id", "size", "price", "usd_amount", "ask_id", "bid_id", "ask_account_id", "bid_account_id", "is_maker_ask", "block_height", "timestamp", "taker_fee", "taker_position_size_before", "taker_entry_quote_before", "taker_initial_margin_fraction_before", "taker_position_sign_changed", "maker_fee", "maker_position_size_before", "maker_entry_quote_before", "maker_initial_margin_fraction_before", "maker_position_sign_changed"];
                    };
                };
            };
            readonly title: "Trades";
            readonly required: readonly ["code", "trades"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ReferralPoints: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly referrals: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly l1_address: {
                                readonly type: "string";
                            };
                            readonly total_points: {
                                readonly type: "number";
                                readonly format: "float";
                                readonly examples: readonly ["1000.01"];
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly week_points: {
                                readonly type: "number";
                                readonly format: "float";
                                readonly examples: readonly ["1000.01"];
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly total_reward_points: {
                                readonly type: "number";
                                readonly format: "float";
                                readonly examples: readonly ["200"];
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly week_reward_points: {
                                readonly type: "number";
                                readonly format: "float";
                                readonly examples: readonly ["200"];
                                readonly minimum: -3.402823669209385e+38;
                                readonly maximum: 3.402823669209385e+38;
                            };
                            readonly reward_point_multiplier: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                        };
                        readonly title: "ReferralPointEntry";
                        readonly required: readonly ["l1_address", "total_points", "week_points", "total_reward_points", "week_reward_points", "reward_point_multiplier"];
                    };
                };
                readonly user_total_points: {
                    readonly type: "number";
                    readonly format: "float";
                    readonly examples: readonly ["1000"];
                    readonly minimum: -3.402823669209385e+38;
                    readonly maximum: 3.402823669209385e+38;
                };
                readonly user_last_week_points: {
                    readonly type: "number";
                    readonly format: "float";
                    readonly examples: readonly ["1000"];
                    readonly minimum: -3.402823669209385e+38;
                    readonly maximum: 3.402823669209385e+38;
                };
                readonly user_total_referral_reward_points: {
                    readonly type: "number";
                    readonly format: "float";
                    readonly examples: readonly ["1000"];
                    readonly minimum: -3.402823669209385e+38;
                    readonly maximum: 3.402823669209385e+38;
                };
                readonly user_last_week_referral_reward_points: {
                    readonly type: "number";
                    readonly format: "float";
                    readonly examples: readonly ["1000"];
                    readonly minimum: -3.402823669209385e+38;
                    readonly maximum: 3.402823669209385e+38;
                };
                readonly reward_point_multiplier: {
                    readonly type: "string";
                    readonly examples: readonly ["0.1"];
                };
            };
            readonly title: "ReferralPoints";
            readonly required: readonly ["referrals", "user_total_points", "user_last_week_points", "user_total_referral_reward_points", "user_last_week_referral_reward_points", "reward_point_multiplier"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const SendTx: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly tx_type: {
                readonly type: "integer";
                readonly format: "uint8";
                readonly minimum: 0;
                readonly maximum: 255;
            };
            readonly tx_info: {
                readonly type: "string";
            };
            readonly price_protection: {
                readonly type: "boolean";
                readonly format: "boolean";
                readonly default: "true";
            };
        };
        readonly title: "ReqSendTx";
        readonly required: readonly ["tx_type", "tx_info"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly tx_hash: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly predicted_execution_time_ms: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1751465474"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "RespSendTx";
            readonly required: readonly ["code", "tx_hash", "predicted_execution_time_ms"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const SendTxBatch: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly tx_types: {
                readonly type: "string";
            };
            readonly tx_infos: {
                readonly type: "string";
            };
        };
        readonly title: "ReqSendTxBatch";
        readonly required: readonly ["tx_types", "tx_infos"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly tx_hash: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly predicted_execution_time_ms: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1751465474"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "RespSendTxBatch";
            readonly required: readonly ["code", "tx_hash", "predicted_execution_time_ms"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Status: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["1"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly network_id: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["1"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly timestamp: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1717777777"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "Status";
            readonly required: readonly ["status", "network_id", "timestamp"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Trades: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly market_id: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly default: "255";
                    readonly minimum: 0;
                    readonly maximum: 255;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly default: "-1";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly order_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly sort_by: {
                    readonly type: "string";
                    readonly enum: readonly ["block_height", "timestamp", "trade_id"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly sort_dir: {
                    readonly type: "string";
                    readonly enum: readonly ["desc"];
                    readonly default: "desc";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly from: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly default: "-1";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly ask_filter: {
                    readonly type: "integer";
                    readonly format: "int8";
                    readonly default: "-1";
                    readonly minimum: -128;
                    readonly maximum: 127;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["sort_by", "limit"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly next_cursor: {
                    readonly type: "string";
                };
                readonly trades: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly trade_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["145"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly tx_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["trade", "liquidation", "deleverage"];
                                readonly examples: readonly ["trade"];
                                readonly description: "`trade` `liquidation` `deleverage`";
                            };
                            readonly market_id: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly examples: readonly ["1"];
                                readonly minimum: 0;
                                readonly maximum: 255;
                            };
                            readonly size: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly usd_amount: {
                                readonly type: "string";
                                readonly examples: readonly ["3024.66"];
                            };
                            readonly ask_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["145"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly bid_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["245"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly ask_account_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly bid_account_id: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["3"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly is_maker_ask: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly taker_fee: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["0"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly taker_position_size_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly taker_entry_quote_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly taker_initial_margin_fraction_before: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["0"];
                            };
                            readonly taker_position_sign_changed: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                            readonly maker_fee: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly examples: readonly ["0"];
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly maker_position_size_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly maker_entry_quote_before: {
                                readonly type: "string";
                                readonly examples: readonly ["0"];
                            };
                            readonly maker_initial_margin_fraction_before: {
                                readonly type: "integer";
                                readonly format: "uin16";
                                readonly examples: readonly ["0"];
                            };
                            readonly maker_position_sign_changed: {
                                readonly type: "boolean";
                                readonly format: "boolean";
                                readonly examples: readonly ["true"];
                            };
                        };
                        readonly title: "Trade";
                        readonly required: readonly ["trade_id", "tx_hash", "type", "market_id", "size", "price", "usd_amount", "ask_id", "bid_id", "ask_account_id", "bid_account_id", "is_maker_ask", "block_height", "timestamp", "taker_fee", "taker_position_size_before", "taker_entry_quote_before", "taker_initial_margin_fraction_before", "taker_position_sign_changed", "maker_fee", "maker_position_size_before", "maker_entry_quote_before", "maker_initial_margin_fraction_before", "maker_position_sign_changed"];
                    };
                };
            };
            readonly title: "Trades";
            readonly required: readonly ["code", "trades"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TransferFeeInfo: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly to_account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly default: "-1";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly transfer_fee_usdc: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "TransferFeeInfo";
            readonly required: readonly ["code", "transfer_fee_usdc"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TransferHistory: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly transfers: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["L2TransferInflow", "L2TransferOutflow", "L2BurnSharesInflow", "L2BurnSharesOutflow", "L2MintSharesInflow", "L2MintSharesOutflow"];
                                readonly description: "`L2TransferInflow` `L2TransferOutflow` `L2BurnSharesInflow` `L2BurnSharesOutflow` `L2MintSharesInflow` `L2MintSharesOutflow`";
                            };
                            readonly from_l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly to_l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly from_account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly to_account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly tx_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                        };
                        readonly title: "TransferHistoryItem";
                        readonly required: readonly ["id", "amount", "timestamp", "type", "from_l1_address", "to_l1_address", "from_account_index", "to_account_index", "tx_hash"];
                    };
                };
                readonly cursor: {
                    readonly type: "string";
                };
            };
            readonly title: "TransferHistory";
            readonly required: readonly ["code", "transfers", "cursor"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Tx: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly by: {
                    readonly type: "string";
                    readonly enum: readonly ["hash", "sequence_index"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly value: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["by", "value"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly hash: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly type: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly maximum: 64;
                    readonly minimum: 1;
                    readonly examples: readonly ["1"];
                };
                readonly info: {
                    readonly type: "string";
                    readonly examples: readonly ["{}"];
                };
                readonly event_info: {
                    readonly type: "string";
                    readonly examples: readonly ["{}"];
                };
                readonly status: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly transaction_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["8761"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly l1_address: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly nonce: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["722"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly expire_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly block_height: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["45434"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly queued_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly executed_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly sequence_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["8761"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly parent_hash: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly committed_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly verified_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "EnrichedTx";
            readonly required: readonly ["code", "hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash", "committed_at", "verified_at"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TxFromL1TxHash: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly hash: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["hash"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly hash: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly type: {
                    readonly type: "integer";
                    readonly format: "uint8";
                    readonly maximum: 64;
                    readonly minimum: 1;
                    readonly examples: readonly ["1"];
                };
                readonly info: {
                    readonly type: "string";
                    readonly examples: readonly ["{}"];
                };
                readonly event_info: {
                    readonly type: "string";
                    readonly examples: readonly ["{}"];
                };
                readonly status: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly transaction_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["8761"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly l1_address: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly nonce: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["722"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly expire_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly block_height: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["45434"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly queued_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly executed_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly sequence_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["8761"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly parent_hash: {
                    readonly type: "string";
                    readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                };
                readonly committed_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
                readonly verified_at: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["1640995200"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "EnrichedTx";
            readonly required: readonly ["code", "hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash", "committed_at", "verified_at"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const Txs: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: 1;
                    readonly maximum: 100;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["limit"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly txs: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly type: {
                                readonly type: "integer";
                                readonly format: "uint8";
                                readonly maximum: 64;
                                readonly minimum: 1;
                                readonly examples: readonly ["1"];
                            };
                            readonly info: {
                                readonly type: "string";
                                readonly examples: readonly ["{}"];
                            };
                            readonly event_info: {
                                readonly type: "string";
                                readonly examples: readonly ["{}"];
                            };
                            readonly status: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly transaction_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["8761"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly l1_address: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                            readonly account_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly nonce: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["722"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly expire_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly block_height: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["45434"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly queued_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly executed_at: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly sequence_index: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["8761"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly parent_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                        };
                        readonly title: "Tx";
                        readonly required: readonly ["hash", "type", "info", "event_info", "status", "transaction_index", "l1_address", "account_index", "nonce", "expire_at", "block_height", "queued_at", "executed_at", "sequence_index", "parent_hash"];
                    };
                };
            };
            readonly title: "Txs";
            readonly required: readonly ["code", "txs"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const WithdrawHistory: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly account_index: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly auth: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " made optional to support header auth clients";
                };
                readonly cursor: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
                readonly filter: {
                    readonly type: "string";
                    readonly enum: readonly ["all", "pending", "claimable"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                };
            };
            readonly required: readonly ["account_index"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: " make required after integ is done";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
                readonly withdraws: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly examples: readonly ["0.1"];
                            };
                            readonly timestamp: {
                                readonly type: "integer";
                                readonly format: "int64";
                                readonly examples: readonly ["1640995200"];
                                readonly minimum: -9223372036854776000;
                                readonly maximum: 9223372036854776000;
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["failed", "pending", "claimable", "refunded", "completed"];
                                readonly description: "`failed` `pending` `claimable` `refunded` `completed`";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["secure", "fast"];
                                readonly description: "`secure` `fast`";
                            };
                            readonly l1_tx_hash: {
                                readonly type: "string";
                                readonly examples: readonly ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"];
                            };
                        };
                        readonly title: "WithdrawHistoryItem";
                        readonly required: readonly ["id", "amount", "timestamp", "status", "type", "l1_tx_hash"];
                    };
                };
                readonly cursor: {
                    readonly type: "string";
                };
            };
            readonly title: "WithdrawHistory";
            readonly required: readonly ["code", "withdraws", "cursor"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const WithdrawalDelay: {
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly seconds: {
                    readonly type: "integer";
                    readonly format: "int64";
                    readonly examples: readonly ["86400"];
                    readonly minimum: -9223372036854776000;
                    readonly maximum: 9223372036854776000;
                };
            };
            readonly title: "RespWithdrawalDelay";
            readonly required: readonly ["seconds"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly examples: readonly ["200"];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly type: "string";
                };
            };
            readonly title: "ResultCode";
            readonly required: readonly ["code"];
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { $Export, Account, AccountActiveOrders, AccountInactiveOrders, AccountLimits, AccountMetadata, AccountTxs, AccountsByL1Address, Announcement, Apikeys, Block, BlockTxs, Blocks, Candlesticks, ChangeAccountTier, CurrentHeight, DepositHistory, ExchangeStats, FastbridgeInfo, FundingRates, Fundings, Info, L1Metadata, Liquidations, NextNonce, NotificationAck, OrderBookDetails, OrderBookOrders, OrderBooks, Pnl, PositionFunding, PublicPoolsMetadata, RecentTrades, ReferralPoints, SendTx, SendTxBatch, Status, Trades, TransferFeeInfo, TransferHistory, Tx, TxFromL1TxHash, Txs, WithdrawHistory, WithdrawalDelay };
