var Migrations = artifacts.require("./Migrations.sol");
var ERA = artifacts.require("./ERA.sol");
var OrgInfo = artifacts.require("./OrgInfo.sol");



module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(ERA);
    deployer.deploy(OrgInfo);
};
