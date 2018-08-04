# Ethereum Registration Authority

Ethereum Registration Authorities (ERA) are entities which host lists which link organization’s blockchain identities to their real world identities. ERAs need to complete a Know Your Customer (KYC) and optionally an Anti-Money Laundering (AML) audit for organizations prior to listing them.

When an organization wishes to establish a private channel with one or more other organizations, they consult ERAs that they trust to get the bootstrapping information for each other organization which they wish to establish a private sidechain with.

ERAs are represented as smart contracts on the blockchain. The smart contract has the following features:
- Only the ERA organization can add and remove organizations from their list.
- Organisations can update their own information.
- Information is stored as a map.

The map contains:
- DNS Message Digest: Kecak256 message digest of the domain name.
- Delegate ERA address: Address of an ERA which manages sub-domains below this domain name. If there is no such ERA, this value is zero.
- OrgInfo address: Address of OrgInfo contract. If there is no such OrgInfo for this domain name, then this is zero.
- Address of domain owner.

The OrgInfo contract holds a map of key value pairs.

Keys are in a reverse domain names followed by organisation specific informaiton.

For example, for sidechains the following are defined:

tech.pegasys.scnode.size               The number of sidechain nodes.
tech.pegasys.scnode.1.enode        Sidechain node 1: enode.
tech.pegasys.scnode.1.enc            Sidechain node 1: encryption public key.



