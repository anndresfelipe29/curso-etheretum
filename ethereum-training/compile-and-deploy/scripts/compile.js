const path = require('path');
const fs = require('fs');
const solc = require('solc');
const chalk = require('chalk');

const contractPath = path.resolve( __dirname, '../contracts','UsersContract.sol');
const source = fs.readFileSync(contractPath , 'UTF-8');

//console.log(chalk.green(source));

//const {interface, bytecode } = solc.compile(source, 1).contracts[':UserContract'];
//https://stackoverflow.com/questions/53604799/solidity-v0-5-0-compiler-error-invalid-callback-specified

const input = {
    language: 'Solidity',
    sources: {
      'UsersContract.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

const compilado = solc.compile(JSON.stringify(input)  );
const output = JSON.parse( compilado);
  console.log(chalk.green(output));
  console.log(output.sources);

const interface_abi = output.contracts['UsersContract.sol']['UserContract'].abi;
const bytecode = output.contracts['UsersContract.sol']['UserContract'].evm.bytecode.object;

//console.log(chalk.red(JSON.stringify(interface_abi[0])));
//console.log(chalk.blue(bytecode));

//exportamos una variable u otras cosas para poder visualizarlas desde otro archivo
module.exports =output;

/*
for (var contractName in output.contracts['UsersContract.sol']) {
    console.log( contractName + ': ' + output.contracts['UsersContract.sol'][contractName].evm.bytecode.object
    );
}
*/
