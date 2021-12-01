import pytest
import brownie
from brownie import FactItem, VoteManager, interface, chain
from scripts.helpful_scripts import get_account, get_contract


@pytest.fixture
def deploy_fact():
    account = get_account()
    fact_item = FactItem.deploy(
        {"from": account}
    )

    return fact_item


@pytest.fixture
def deploy_fact_and_vote_manager(
    deploy_fact,
):
    fact_item = deploy_fact

    account = get_account()
    vote_mgr = VoteManager.deploy(
        fact_item,
        {"from": account}
    )

    return fact_item, vote_mgr


def test_can_mint_fact(
    deploy_fact,
):
    fact_item = deploy_fact
    account = get_account(1)

    assert fact_item.totalSupply() == 0

    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    assert fact_item.totalSupply() == 1
    assert fact_item.tokenURI(1) == "http://www.dummy.com"


def test_cannot_mint_same_fact(
    deploy_fact,
):
    fact_item = deploy_fact
    account = get_account(1)

    assert fact_item.totalSupply() == 0

    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    assert fact_item.totalSupply() == 1

    with brownie.reverts():
        tx = fact_item.mintItem(
            "http://www.dummy.com",
            {"from": account}
        )

        assert tx.reverts_msg == "fact URL already added"

def test_can_vote(
    deploy_fact_and_vote_manager,
):
    fact_item, vote_mgr = deploy_fact_and_vote_manager

    account = get_account(1)
    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    assert fact_item.totalSupply() == 1

    vote_account = get_account(2)

    assert vote_mgr.getVoteForAddress(
        vote_account,
        1,
        {"from": vote_account}
    ) == 0

    vote_mgr.vote(
        1,
        1, # for
        {"from": vote_account}
    )

    assert vote_mgr.getNumVotedFactsForAddress(
        vote_account,
        {"from": vote_account}
    ) == 1


def test_multiple_votes(
    deploy_fact_and_vote_manager,
):
    fact_item, vote_mgr = deploy_fact_and_vote_manager

    account = get_account(1)
    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    assert fact_item.totalSupply() == 1

    vote_account = get_account(2)

    vote_mgr.vote(
        1,
        1, # for
        {"from": vote_account}
    )

    vote_account2 = get_account(3)

    vote_mgr.vote(
        1,
        2, # against
        {"from": vote_account2}
    )

    num_votes_for, num_votes_against = vote_mgr.getNumVotesForFact(
        1,
        {"from": vote_account}
    )

    assert (num_votes_for, num_votes_against) == (1, 1)
 

def test_owner_cannot_vote(
    deploy_fact_and_vote_manager,
):
    fact_item, vote_mgr = deploy_fact_and_vote_manager

    account = get_account(1)
    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    with brownie.reverts():
        tx = vote_mgr.vote(
            1,
            1, # for
            {"from": account}
        )
        assert tx.revert_msg == "owner cannot vote"


def test_can_change_vote(
    deploy_fact_and_vote_manager,
):
    fact_item, vote_mgr = deploy_fact_and_vote_manager

    account = get_account(1)
    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    assert fact_item.totalSupply() == 1

    vote_account = get_account(2)

    assert vote_mgr.getVoteForAddress(
        vote_account,
        1,
        {"from": vote_account}
    ) == 0

    vote_mgr.vote(
        1,
        1, # for
        {"from": vote_account}
    )

    assert vote_mgr.getNumVotedFactsForAddress(
        vote_account,
        {"from": vote_account}
    ) == 1

    vote_mgr.vote(
        1,
        2, # against
        {"from": vote_account}
    )

    assert vote_mgr.getNumVotedFactsForAddress(
        vote_account,
        {"from": vote_account}
    ) == 1

    vote_mgr.vote(
        1,
        0, # neutral
        {"from": vote_account}
    )

    assert vote_mgr.getNumVotedFactsForAddress(
        vote_account,
        {"from": vote_account}
    ) == 0


def test_num_votes_multiple_facts(
    deploy_fact_and_vote_manager,    
):
    fact_item, vote_mgr = deploy_fact_and_vote_manager

    account = get_account(1)
    fact_item.mintItem(
        "http://www.dummy.com",
        {"from": account}    
    )

    fact_item.mintItem(
        "http://www.dummy2.com",
        {"from": account}    
    )

    assert fact_item.totalSupply() == 2

    vote_account = get_account(2)

    vote_mgr.vote(
        1,
        1, # for
        {"from": vote_account}
    )

    vote_mgr.vote(
        2,
        1, # for
        {"from": vote_account}
    )

    assert vote_mgr.getNumVotedFactsForAddress(
        vote_account,
        {"from": vote_account}
    ) == 2