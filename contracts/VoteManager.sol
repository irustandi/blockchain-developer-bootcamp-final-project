// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./FactItem.sol";

contract VoteManager {
    enum Vote {
        Neutral, For, Against
    }

    struct VoteInfo {
        uint numVoteFor;
        uint numVoteAgainst;
    }

    FactItem factItem;
    mapping (address => mapping (uint => Vote)) voteStatus;
    mapping (address => VoteInfo) addressVoteInfo;
    mapping (uint => VoteInfo) factVoteInfo;

    constructor(
        FactItem _factItem
    ) {
        factItem = _factItem;
    }

    function vote(uint _factId, Vote _vote) external {
        require(_factId <= factItem.totalSupply(), "non-existent fact for ID");
        require(msg.sender != factItem.ownerOf(_factId), "owner cannot vote");
        require(_vote != voteStatus[msg.sender][_factId], "vote doesn't change");

        Vote oldVote = voteStatus[msg.sender][_factId];
        if (oldVote == Vote.For) {
            addressVoteInfo[msg.sender].numVoteFor--;
            factVoteInfo[_factId].numVoteFor--;
        } else if (oldVote == Vote.Against) {
            addressVoteInfo[msg.sender].numVoteAgainst--;
            factVoteInfo[_factId].numVoteAgainst--;
        }

        voteStatus[msg.sender][_factId] = _vote;
        if (_vote == Vote.For) {
            addressVoteInfo[msg.sender].numVoteFor++;
            factVoteInfo[_factId].numVoteFor++;
        } else if (_vote == Vote.Against) {
            addressVoteInfo[msg.sender].numVoteAgainst++;
            factVoteInfo[_factId].numVoteAgainst++;
        }
    }

    function getNumVotedFactsForAddress(address _addr) view external returns (uint numFacts) {
        VoteInfo storage voteInfo = addressVoteInfo[_addr];

        numFacts = voteInfo.numVoteFor + voteInfo.numVoteAgainst;
    }

    function getVoteForAddress(address _addr, uint _factId) view external returns (Vote vote) {
        vote = voteStatus[_addr][_factId];
    }

    function getNumVotesForFact(uint _factId) view external returns (uint numVoteFor, uint numVoteAgainst) {       
        VoteInfo storage voteInfo = factVoteInfo[_factId];

        numVoteFor = voteInfo.numVoteFor;
        numVoteAgainst = voteInfo.numVoteAgainst;
    }
}