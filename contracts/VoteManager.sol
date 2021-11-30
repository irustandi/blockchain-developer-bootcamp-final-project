// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./FactItem.sol";

contract VoteManager {
    enum VoteChoice {
        Neutral, For, Against
    }

    struct VoteInfo {
        uint numVoteFor;
        uint numVoteAgainst;
    }

    event Vote(uint indexed factId, address indexed voter, VoteChoice vote);

    FactItem factItem;
    mapping (address => mapping (uint => VoteChoice)) voteStatus;
    mapping (address => VoteInfo) addressVoteInfo;
    mapping (uint => VoteInfo) factVoteInfo;

    constructor(
        FactItem _factItem
    ) {
        factItem = _factItem;
    }

    function vote(uint _factId, VoteChoice _vote) external {
        require(_factId <= factItem.totalSupply(), "non-existent fact for ID");
        require(msg.sender != factItem.ownerOf(_factId), "owner cannot vote");
        require(_vote != voteStatus[msg.sender][_factId], "vote doesn't change");

        VoteChoice oldVote = voteStatus[msg.sender][_factId];
        if (oldVote == VoteChoice.For) {
            addressVoteInfo[msg.sender].numVoteFor--;
            factVoteInfo[_factId].numVoteFor--;
        } else if (oldVote == VoteChoice.Against) {
            addressVoteInfo[msg.sender].numVoteAgainst--;
            factVoteInfo[_factId].numVoteAgainst--;
        }

        voteStatus[msg.sender][_factId] = _vote;
        if (_vote == VoteChoice.For) {
            addressVoteInfo[msg.sender].numVoteFor++;
            factVoteInfo[_factId].numVoteFor++;
        } else if (_vote == VoteChoice.Against) {
            addressVoteInfo[msg.sender].numVoteAgainst++;
            factVoteInfo[_factId].numVoteAgainst++;
        }

        emit Vote(_factId, msg.sender, _vote);
    }

    function getNumVotedFactsForAddress(address _addr) view external returns (uint numFacts) {
        VoteInfo storage voteInfo = addressVoteInfo[_addr];

        numFacts = voteInfo.numVoteFor + voteInfo.numVoteAgainst;
    }

    function getVoteForAddress(address _addr, uint _factId) view external returns (VoteChoice vote) {
        vote = voteStatus[_addr][_factId];
    }

    function getNumVotesForFact(uint _factId) view external returns (uint numVoteFor, uint numVoteAgainst) {       
        VoteInfo storage voteInfo = factVoteInfo[_factId];

        numVoteFor = voteInfo.numVoteFor;
        numVoteAgainst = voteInfo.numVoteAgainst;
    }
}