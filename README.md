# Decentrafact: Decentralized Censorship-Resistant News Evaluation Application (aka Fact-Checking)

## Background

In the last few years, we see the rise of the "fake news" label given to news pieces deemed misleading. While the effort to label potentially misleading news pieces might seem laudable, we see more recently that such effort has also led to those with certain agenda using this label and pushing for pieces not in line with their agenda to be censored. This has poisoned healthy public discourse.

One example: in the beginning of COVID-19, some people brought up the possibility that COVID-19 might have come out of a leak from a laboratory in China. Any articles bringing up this theory was labeled with misleading tag in the major social media platforms. However, more recently, this theory is deemed to be more and more plausible, and hence the misleading label applied earlier might seem premature.

## Mechanism Design

In the application, a user can have a couple of roles:

- proposer: propose a news piece (fact) to be evaluated
- evaluator: evaluate (vote on) a news piece

Each fact is captured by an ERC721 token. At the moment, a vote is binary: either FOR or AGAINST. There is also an option to remove a vote. A restriction is that a proposer cannot vote on a fact that he/she proposed.

To facilitate meaningful activities, it is important to design the mechanism so that the incentives of the users are aligned properly. This is not currently addressed yet, but to achieve this, a reward/punishment mechanism can be proposed using tokens specific to the app.

## Directory Structure

- contracts/, contains the smart contract implementation
- front_end/, contains the front-end code
- scripts/, contains the deployment script
- tests/, contains unit tests

## Dependencies

- [brownie](https://eth-brownie.readthedocs.io/en/stable/), along with the associated Python dependencies
- For local testing, I use [hardhat](https://eth-brownie.readthedocs.io/en/stable/install.html#using-brownie-with-hardhat) in conjunction with brownie

Credit to Chainlink for providing the [brownie starter kit](https://github.com/smartcontractkit/chainlink-mix).

It is recommended to have a .env file with these variables:

- WEB3_INFURA_PROJECT_ID
- PRIVATE_KEY

## Compiling and Testing

- To compile, run 'brownie compile'
- To test, run 'brownie test'

It is possible to deploy to various networks (to rinkeby in the example) running

brownie run ./scripts/decentrafact_scripts/01_deploy_decentrafact_contracts.py --network rinkeby

## Front-End

A basic front-end is available at [https://decentrafact.herokuapp.com](https://decentrafact.herokuapp.com). The front-end is developed using React and [useDapp](https://usedapp.io/).

Video demo: [https://vimeo.com/651811013/893a122ac1](https://vimeo.com/651811013/893a122ac1)

## ETH address for certificate NFT

0x15F3d667792f2E8C8D4822374120a57FD572f5fA
