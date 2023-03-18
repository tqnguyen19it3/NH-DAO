const NHDAO = artifacts.require('NHDAO')

module.exports = async function (deployer) {
  await deployer.deploy(NHDAO)
}
