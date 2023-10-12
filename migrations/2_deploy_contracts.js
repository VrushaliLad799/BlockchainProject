var TimberSupplyChain = artifacts.require("./TimberSupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(TimberSupplyChain);
};