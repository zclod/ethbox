module.exports = {
    build: {
        "index.html": "index.html",
        "app.js": [
            "../node_modules/ipfs-api/dist/index.js",
            "javascripts/app.js"
        ],
        "app.css": [
            "stylesheets/app.css"
        ],
        "images/": "images/"
    },
    deploy: [
        "ContractRegistry",
        "ECVerify"
    ],
    rpc: {
        host: "localhost",
        port: 8545
    }
};
