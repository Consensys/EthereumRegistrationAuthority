package tech.pegasys.era;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import java.util.ArrayList;
import java.util.List;

public class ExampleTwo {

    public static void main (String args[]) throws Exception {

        String privateKey = "0x5f52d0b37fd6e5e762688869b3f1084a8bf438c1e75d57d79372af1107fd0427";
        String topEraContractAddress = "0x75cb22f76527e58c8aab8f6a50412df6cba22114";
        String finderAddress = "0xb417f71159ff9ffd583c840d4717d384d5977f16";

        Web3j web3j = Web3j.build(new HttpService());
        Credentials credentials = Credentials.create(privateKey);

        EthereumRegistrationAuthorityFactory eraFactory = new EthereumRegistrationAuthorityFactory(web3j, credentials);
        System.out.println("Load Finder...");
        Finder finder = eraFactory.finderAtAddressRead(finderAddress);
        List<String> eraList = new ArrayList<>();
        eraList.add(topEraContractAddress);
        System.out.println("Find Domain Info...");
        String domainInfoAddress = finder.resolveDomain(eraList,
                "a1.aa.example.com",
                "aa.example.com",
                "example.com",
                "com");
        System.out.println("DomainInfo address at: " + domainInfoAddress);
        System.out.println("Load domainInfo...");
        DomainInfo domainInfo = eraFactory.domainInfoAtAddressRead(domainInfoAddress);
        String data = new String(domainInfo.getValue("enode"), "UTF-8");    //Get enode address
        System.out.println("Data stored is: " + data);
    }
}
