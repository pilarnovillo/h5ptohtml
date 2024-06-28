"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// We need to use https-proxy-agent as the default Axios proxy functionality
// doesn't work with https.
var https_proxy_agent_1 = require("https-proxy-agent");
/**
 * Creates an Axios instance that supports corporate HTTPS proxies.
 * The proxy can either be configured in the config's proxy property or by
 * setting the environment variable HTTPS_PROXY.
 * @param config the H5P config object
 * @returns the AxiosInstance
 */
var getClient = function (config) {
    var proxyAgent;
    if (config.proxy) {
        proxyAgent = (0, https_proxy_agent_1.default)({
            host: config.proxy.host,
            port: config.proxy.port,
            protocol: config.proxy.protocol === 'https' ? 'https:' : undefined
        });
    }
    else if (process.env.HTTPS_PROXY) {
        proxyAgent = (0, https_proxy_agent_1.default)(process.env.HTTPS_PROXY);
    }
    return axios_1.default.create({
        proxy: proxyAgent ? false : undefined,
        httpsAgent: proxyAgent
    });
};
exports.default = getClient;
