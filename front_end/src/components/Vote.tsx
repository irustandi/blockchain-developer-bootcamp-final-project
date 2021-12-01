import React, { useState } from "react";
import {
  ContractCall,
  useContractCall,
  useContractCalls,
  useContractFunction,
  useEthers,
} from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import { Box, Button, MenuItem, Select, makeStyles } from "@material-ui/core";
import { ConnectionRequiredMsg } from "./ConnectionRequiredMsg";
import VoteManager from "../chain-info/VoteManager.json";
import FactItem from "../chain-info/FactItem.json";

interface VoteProps {
  contractAddresses: Record<string, string>;
}

export type Fact = {
  tokenId: number;
  url: string;
  numVotesFor: number;
  numVotesAgainst: number;
};

const useStyles = makeStyles((theme) => ({
  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
  },
  box: {
    backgroundColor: "white",
    borderRadius: "25px",
    margin: `${theme.spacing(4)}px 0`,
    padding: theme.spacing(2),
  },
  header: {
    color: "white",
  },
}));

const getVoteManagerContract = (address: any) => {
  const { abi } = VoteManager;
  const contractInterface = new utils.Interface(abi);
  const voteMgrContract = new Contract(address, contractInterface);
  return voteMgrContract;
};

const getMenuItem = (fact: Fact) => {
  return (
    <MenuItem value={fact.tokenId}>
      {fact.tokenId}: {fact.url}
    </MenuItem>
  );
};

export const Vote = ({ contractAddresses }: VoteProps) => {
  const classes = useStyles();

  const [tokenId, setTokenId] = useState<number>(1);
  const [numVotesFor, setNumVotesFor] = useState(0);
  const [numVotesAgainst, setNumVotesAgainst] = useState(0);

  const { account } = useEthers();
  const isConnected = account !== null;

  const { abi: factItemABI } = FactItem;
  const factItemInterface = new utils.Interface(factItemABI);
  const { abi: voteMgrABI } = FactItem;
  const voteMgrInterface = new utils.Interface(voteMgrABI);

  const totalSupplyRetVal = useContractCall({
    abi: factItemInterface,
    address: contractAddresses["FactItem"],
    method: "totalSupply",
    args: [],
  });
  const numFacts = totalSupplyRetVal === undefined ? 0 : totalSupplyRetVal[0];
  let calls: ContractCall[] = [];
  let voteCalls: ContractCall[] = [];
  for (let i = 0; i < numFacts; i++) {
    calls.push({
      abi: factItemInterface,
      address: contractAddresses["FactItem"],
      method: "tokenURI",
      args: [i + 1],
    });

    voteCalls.push({
      abi: voteMgrInterface,
      address: contractAddresses["VoteManager"],
      method: "getNumVotesForFact",
      args: [i + 1],
    });
  }

  const tokenURIRetVal = useContractCalls(calls);
  console.log(tokenURIRetVal);
  const numVotesRetVal = useContractCalls(voteCalls);
  console.log(numVotesRetVal);

  let facts: Fact[] = [];
  if (tokenURIRetVal !== undefined && numVotesRetVal !== undefined) {
    for (let i = 0; i < numFacts; i++) {
      facts.push({
        tokenId: i + 1,
        url: String(tokenURIRetVal[i]),
        numVotesFor:
          numVotesRetVal[i] !== undefined && numVotesRetVal[i]![0] !== undefined
            ? numVotesRetVal[i]![0]
            : 0,
        numVotesAgainst:
          numVotesRetVal[i] !== undefined && numVotesRetVal[i]![1] !== undefined
            ? numVotesRetVal[i]![1]
            : 0,
      });
    }
  }

  const menuItems = facts.map(getMenuItem);

  const contract = getVoteManagerContract(contractAddresses["VoteManager"]);
  const { state: stateVote, send: sendVote } = useContractFunction(
    contract,
    "vote"
  );
  const submitVote = (tokenId: number, vote: number) => {
    sendVote(tokenId, vote);
  };

  const handleChange = (event: any) => {
    setTokenId(event.target.value);
    setNumVotesFor(facts[tokenId].numVotesFor);
    setNumVotesAgainst(facts[tokenId].numVotesAgainst);
  };

  const handleClickFor = (event: any) => {
    submitVote(tokenId, 1);
  };

  const handleClickAgainst = (event: any) => {
    submitVote(tokenId, 2);
  };

  const handleClickRemove = (event: any) => {
    submitVote(tokenId, 0);
  };

  return (
    <Box className={classes.box}>
      <div>
        {isConnected ? (
          facts.length === 0 ? (
            <Box>No facts are available to vote</Box>
          ) : (
            <>
              <Box>
                <Select value={tokenId} onChange={handleChange}>
                  {menuItems}
                </Select>
              </Box>
              <Box>
                Token {tokenId}
                <br />
                For votes: {numVotesFor}
                <br />
                Against votes: {numVotesAgainst}
              </Box>
              <Box>
                <Button variant="contained" onClick={handleClickFor}>
                  Vote For
                </Button>
                <Button variant="contained" onClick={handleClickAgainst}>
                  Vote Against
                </Button>
                <Button variant="contained" onClick={handleClickRemove}>
                  Remove Vote
                </Button>
              </Box>
            </>
          )
        ) : (
          <ConnectionRequiredMsg />
        )}
      </div>
    </Box>
  );
};
