#!/usr/bin/python3
from scripts.helpful_scripts import get_account
from brownie import FactItem, VoteManager, config, network


def deploy_fact_item():
    account = get_account()
    return FactItem.deploy(
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )


def deploy_vote_manager(fact_item):
    account = get_account()
    return VoteManager.deploy(
        fact_item,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )


def main():
    fact_item = deploy_fact_item()
    vote_mgr = deploy_vote_manager(fact_item)

    return fact_item, vote_mgr
