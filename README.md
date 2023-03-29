# Deviants Contract

Deviants main contract 

### Introduction
Deviant mint contract.
* * *

### How to Use
* *
1. Adhereing to EIP712, the deployer signs typedData for the whitelisted.

2. The whitelisted accesses the dApp and mints either one for free and a second for 0.0035 ETH.

3. Signature verification occurs on both the UI and at a smart contract level.

4. Signatures are only valid for the address they are created for.
* *
* * *

* * *
### More Information 
* *

```javascript
Running 4 tests for test/NFTPremint/NFTPremint.t.sol:NFTPremintTest
[PASS] test_Airdrop() (gas: 479753)
[PASS] test_MaxMints() (gas: 143401382)
[PASS] test_Mints() (gas: 232934)
[PASS] test_Transfers() (gas: 497339)
Test result: ok. 4 passed; 0 failed; finished in 87.41ms
```

[Deviants Website](https://www.deviantsnft.com/)

[Deviants Twitter](https://twitter.com/DeviantsNFT)

[Mint Portal](https://www.mint.deviantsnft.com/)

[Astra Nova Website](https://astranova.world/)

* *

* * *


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat coverage --testfiles 'test/**/*.js'
```
