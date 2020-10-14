let UsersContract = artifacts.require("./UserContract.sol");

module.exports = function(deployer){
    deployer.deploy(UsersContract);
}