// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./FactItem.sol";

/**
 *  @title A contract managing votes associated with facts
 *  @notice Each vote can be of three kinds: FOR, AGAINST, or NEUTRAL.
 *  @notice NEUTRAL effectively removes the vote.
 */
contract VoteManager {
    enum VoteChoice {
        Neutral, For, Against
    }

    struct VoteInfo {
        uint numVoteFor;
        uint numVoteAgainst;
    }

    /**
     *  @param factId the ID for the fact
     *  @param voter the address of the voter
     *  @param vote the vote cast
     */
    event Vote(uint indexed factId, address indexed voter, VoteChoice vote);

    FactItem factItem;
    mapping (address => mapping (uint => VoteChoice)) voteStatus;
    mapping (address => VoteInfo) addressVoteInfo;
    mapping (uint => VoteInfo) factVoteInfo;

    /**
     *  @notice Construct the vote manager.
     *  @param _factItem the fact item contract
     */
    constructor(
        FactItem _factItem
    ) {
        factItem = _factItem;
    }

    /**
     *  @notice Cast a vote for a fact.
     *  @param _factId the ID for the fact
     *  @param _vote the vote cast
     */
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

    /**
     *  @notice For a given voter, returns the number of facts for which the voter votes.
     *  @param _addr the voter address
     *  @return numFacts the number of facts voted on by the voter
     */
    function getNumVotedFactsForAddress(address _addr) view external returns (uint numFacts) {
        VoteInfo storage voteInfo = addressVoteInfo[_addr];

        numFacts = voteInfo.numVoteFor + voteInfo.numVoteAgainst;
    }

    /**
     *  @notice Get the associated vote for a voter and a fact
     *  @param _addr the voter address
     *  @param _factId the ID of the fact
     *  @return vote the vote cast
     */
    function getVoteForAddress(address _addr, uint _factId) view external returns (VoteChoice vote) {
        vote = voteStatus[_addr][_factId];
    }

    /**
     *  @notice For a fact, get the number of votes (FOR and AGAINST) cast
     *  @param _factId the ID of the fact
     *  @return numVoteFor the number of FOR votes
     *  @return numVoteAgainst the number of AGAINST votes
     */
    function getNumVotesForFact(uint _factId) view external returns (uint numVoteFor, uint numVoteAgainst) {       
        VoteInfo storage voteInfo = factVoteInfo[_factId];

        numVoteFor = voteInfo.numVoteFor;
        numVoteAgainst = voteInfo.numVoteAgainst;
    }
}