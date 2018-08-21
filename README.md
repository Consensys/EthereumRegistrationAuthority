# Ethereum Registration Authority

Ethereum Registration Authorities (ERA) are entities which operate Ethereum
smart contracts which link organizations' blockchain identities, domain names 
and real world identities. Domain names are linked to Ethereum accounts via
smart contracts. The linkage to real world identities is done by the ERAs 
completing Know Your Customer (KYC) audits of organizations prior to listing them. 

A key aspect of the ERA system is that organisations control their own information.
They can update their own information when and as they see fit. They can choose to 
list with any or all root registration authorities, or become a root registration 
authority themselves. 

Applications that wish to use the ERA system choose which ERAs they trust. The are 
able to iteratively search through delegate ERAs to find the domain specific information
they need.  


## Example Usage
The diagram below shows an example of contracts used in the Ethereum Registration 
Authority system.

![alt text](diagram-architecture1.png "Architecture")

In the example, there are two root registration authorities, **A** and **B**. Root ERA **A** 
has an entry for example.com. Example.com is also listed in root ERA **B**. As such, applications
which need to access information about example.com or any of its sub-domains could use  
Root ERA **A** or Root ERA **B**. 

Example.com operates a delegate ERA contract. It has two sub-domains listed s1.example.com and 
s2.example.com. The entries for each sub-domain point to separate DomainInfo contracts which 
hold the domain specific information. 

Bank.co.uk is only listed in Root ERA **B** and does not operate a delegate registration
authority. Its entry in Root ERA **B** points directly at the DomainInfo contract for 
bank.co.uk.

Supply.com operates a delegate ERA. It has a sub-domain aa.supply.com listed. This sub-domain
indicates the delegate ERA for its sub-domains is the supply.com ERA. As such, a1.aa.supply.com
and a2.aa.supply.com are listed in the supply.com ERA. Alternatively, a the sub-domains
a1.aa.supply.com and/or a2.aa.supply.com could have been listed in a separate delegate ERA.
Doing this would allow control of the sub-domains to be handled by a different group within
supply.com, such as a separate business unit. Both sub-domains a1.aa.supply.com and a2.aa.supply.com
use the same DomainInfo contract to store their domain information. 


## Expected Usage
The initial usage is envisaged as to be used for bootstrapping sidechains for use in permissioned 
networks. This technology could be used for any situation in which blockchain information needs 
to be tied to a domain name, each domain name holder should be able to control their information,
and where a central root registration authority is not desirable.  


## Details of Contracts 
### Overview
There are three sets of contracts:
* EthereumRegistrationAuthorityInterface and implementation(s): Root and delegate ERA.
* DomainInfoInterface and implementation(s): Key - value map of domain specific data.
* FinderInterface and implementation(s): Domain name resolver.

Each set of contract has an interface which applications should use. Implementations all return
version numbers. It is anticipated that there may in the future be new functions added. Applications
should be written such that they fetch the version number to understand which functions have
been implemented.  


### Ethereum Registration Authority Interface
There are two main transaction functions:
* addUpdateDomain: Add or update the domain entry. Only the ERA contract owner can add a new 
domain listing. Only the domain owner can update a domain listing.
* removeDomain: Remove a domain entry. Only the ERA contract owner can remove a domain listing.

These functions and the getter functions take a domain hash. The domain hash is calculated as:

    ```Domain Hash = Kecak256(domain name)```

The following information is stored for each domain entry:
* Domain Authority: The address of the ERA contract which manages sub-domains, if such
   a delegate ERA exists for the domain. 
* DomainInfo: Address of DomainInfo contract if such a contract exists for the domain.
* Domain Owner: The owner of the domain entry.

### Domain Info Interface
The DomainInfo contract holds a map of key - value pairs. Keys are the message digest of the 
raw key. Raw keys are the domain names they pertain to followed by the key type.
That is:

    ```keccak256(domain name, ":", key type)```
    
The domain name is the full domain name ("a2.aa.supply.com") or the special wild 
card domain ("*"). Keys which use the wild card provide default values for all domains in this Domain 
Information contract.

The key type is either a value defined below or a user defined values. To avoid name collision, 
user defined keys should be prefixed using reverse domain name ordering for the domain which 
creates the key.

|Defined Keys              | Expected Value and Value Format                                                  |
| ------------------------ | -------------------------------------------------------------------------------- |
| dns.a                    | IPv4 address as described in RFC 1035: https://tools.ietf.org/html/rfc1035       |
| dns.aaaa                 | IPv6 address as described in RFC 3596: https://tools.ietf.org/html/rfc3596       |
| dns.txt                  | Text strings as described in RFC 1035: https://tools.ietf.org/html/rfc1035       |
| ef.enode                 | Enode address in ASCII as described here: https://github.com/ethereum/wiki/wiki/enode-url-format |
| tech.pegasys.sc.enc      | Public encryption key / key agreement key for the Enterprise Ethereum node.      |
| tech.pegasys.sc.size     | The maximum number of nodes in a sidechain cluster. Domain names for the cluster are expected to be named sc0.domain to sc(size-1).domain. |
| tech.pegasys.contact.email | Email address to use to contact the owner of the domain.                       |

The table below shows the example keys.

| Example Key                                                 | Description       |
| ----------------------------------------------------------- | -------------------------------------- |
| keccak256(pegasys.tech:dns.a)                               |The IPv4 address for pegasys.tech.
| keccak256(*.sidechain.pegasys.tech:tech.pegasys.sc.size)    |The maximum number of nodes in the sidechain cluster for sidechain.pegasys.tech.
| keccak256(sc3.sidechain.pegasys.tech:ef.enode)              |The enode address of node sc3.sidechain.pegasys.tech.
| keccak256(*:tech.pegasys.contact.email)                     |The email address to be used to contact the owner of the DomainInfo instance.


### Finder

To be completed.



