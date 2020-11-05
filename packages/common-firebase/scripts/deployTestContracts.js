const shell = require('shelljs');

const deployTestsContracts = () => {
  // Clone the database
  shell.exec('git clone https://github.com/gnosis/safe-contracts');

  // Move to the directory and install dependencies
  shell.cd('safe-contracts');
  shell.exec('yarn');

  // Deploy the contracts
  shell.exec('yarn deploy');

  // Do little cleanup
  shell.cd('..');
  shell.exec('rm -rf safe-contracts');
};

deployTestsContracts();