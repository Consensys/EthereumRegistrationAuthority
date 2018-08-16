/*
 * Copyright 2018 ConsenSys AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
var Migrations = artifacts.require("./Migrations.sol");
var ERA = artifacts.require("./ERA_v1.sol");
var ERAv2 = artifacts.require("./ERA_v2.sol");
var OrgInfo = artifacts.require("./OrgInfo_v1.sol");
var Resolver = artifacts.require("./Resolver_v1.sol");



module.exports = function(deployer) {
    deployer.deploy(Migrations);
    deployer.deploy(ERA);
    deployer.deploy(ERAv2);
    deployer.deploy(OrgInfo);
    deployer.deploy(Resolver);
};
