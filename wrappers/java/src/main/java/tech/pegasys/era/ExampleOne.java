package tech.pegasys.era;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import java.nio.charset.StandardCharsets;

public class ExampleOne {

    public static void main (String args[]) throws Exception {

        String privateKey = "0x5f52d0b37fd6e5e762688869b3f1084a8bf438c1e75d57d79372af1107fd0427";
        Web3j web3j = Web3j.build(new HttpService());
        Credentials credentials = Credentials.create(privateKey);

        EthereumRegistrationAuthorityFactory eraFactory = new EthereumRegistrationAuthorityFactory(web3j, credentials);

        System.out.println("Deploy ERA contracts...");
        EthereumRegistrationAuthority eraTop = eraFactory.deployEra();          //*.com
        System.out.println("ERA top contract address: " + eraTop.getContractAddress());
        EthereumRegistrationAuthority eraSecond = eraFactory.deployEra();       //*.example.com
        System.out.println("ERA second contract address: " + eraSecond.getContractAddress());
        EthereumRegistrationAuthority eraThirdA = eraFactory.deployEra();       //*.aa.example.com
        System.out.println("ERA third-a contract address: " + eraThirdA.getContractAddress());
        EthereumRegistrationAuthority eraThirdB = eraFactory.deployEra();       //*.bb.example.com
        System.out.println("ERA third-b contract address: " + eraThirdB.getContractAddress());

        System.out.println("Deploy Domain Info...");
        DomainInfo A1Info = eraFactory.deployDomainInfo();
        System.out.println("A1 info contract address: " + A1Info.getContractAddress());
        DomainInfo A2Info = eraFactory.deployDomainInfo();
        System.out.println("A2 info contract address: " + A2Info.getContractAddress());
        DomainInfo B1Info = eraFactory.deployDomainInfo();
        System.out.println("B1 info contract address: " + B1Info.getContractAddress());
        DomainInfo B2Info = eraFactory.deployDomainInfo();
        System.out.println("B2 info contract address: " + B2Info.getContractAddress());

        System.out.println("Set up value...");
        TransactionReceipt receipt;
        receipt = A1Info.setValue("enode", "enode:a1.example".getBytes(StandardCharsets.UTF_8));            //Enode address for a1.aa.example.com
        System.out.println("A1Info set up in block " + receipt.getBlockNumberRaw());
        receipt = A2Info.setValue("enode", "enode:a2.example".getBytes(StandardCharsets.UTF_8));            //Enode address for a2.aa.example.com
        System.out.println("A2Info set up in block " + receipt.getBlockNumberRaw());
        receipt = B1Info.setValue("enode", "enode:b1.example".getBytes(StandardCharsets.UTF_8));            //Enode address for b1.bb.example.com
        System.out.println("B1Info set up in block " + receipt.getBlockNumberRaw());
        receipt = B2Info.setValue("enode", "enode:b2.example".getBytes(StandardCharsets.UTF_8));            //Enode address for b2.bb.example.com
        System.out.println("B2Info set up in block " + receipt.getBlockNumberRaw());

        System.out.println("Set up domains...");
        receipt = eraThirdA.addUpdateDomain("a1.aa.example.com", "0x01",
                A1Info.getContractAddress(), "0x01");
        System.out.println("Third A set up at block " + receipt.getBlockNumberRaw());
        receipt = eraThirdA.addUpdateDomain("a2.aa.example.com", "0x01",
                A2Info.getContractAddress(), "0x01");
        System.out.println("Third A set up at block " + receipt.getBlockNumberRaw());
        receipt = eraThirdB.addUpdateDomain("b1.bb.example.com", "0x01",
                B1Info.getContractAddress(), "0x01");
        System.out.println("Third B set up at block " + receipt.getBlockNumberRaw());
        receipt = eraThirdB.addUpdateDomain("b2.bb.example.com", "0x01",
                B2Info.getContractAddress(), "0x01");
        System.out.println("Third B set up at block " + receipt.getBlockNumberRaw());
        receipt = eraSecond.addUpdateDomain("aa.example.com", eraThirdA.getContractAddress(),
                "0x01", "0x01");
        System.out.println("Second set up at block " + receipt.getBlockNumberRaw());
        receipt = eraSecond.addUpdateDomain("bb.example.com", eraThirdB.getContractAddress(),
                "0x01", "0x01");
        System.out.println("Second set up at block " + receipt.getBlockNumberRaw());
        receipt = eraTop.addUpdateDomain("example.com", eraSecond.getContractAddress(),
                "0x01", "0x01");
        System.out.println("Top set up at block " + receipt.getBlockNumberRaw());
        System.out.println("Setup done.");
    }
}
