var Migrations = artifacts.require("./Migrations.sol");
var ERA = artifacts.require("./ERA_v1.sol");
var OrgInfo = artifacts.require("./OrgInfo_v1.sol");
var Resolver = artifacts.require("./Resolver_v1.sol");



module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(ERA);
    deployer.deploy(OrgInfo);
    deployer.deploy(Resolver);
};
