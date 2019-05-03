/*
 * Copyright 2019 ConsenSys AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package tech.pegasys.era.tools;

import tech.pegasys.era.*;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 *  A tool to auto config and deploy a network of Eras.
 */
public class EraNetworkConfig {

    /* The ERA Factory */
    private EthereumRegistrationAuthorityFactory factory;

    /* The Finder instance */
    private Finder finder;

    /* The Root ERA instance */
    private EthereumRegistrationAuthority root;

    /* The Root ERA Address */
    private String rootAddress;

    /**
     * Constructor
     * @param factory - The ERA Factory
     * @param rootAddress - The address for the root era
     * @param finderAddress - The address for the finder
     */
    public EraNetworkConfig(EthereumRegistrationAuthorityFactory factory, String rootAddress, String finderAddress) {
        this.factory = factory;
        root = factory.eraAtAddressWrite(rootAddress);
        finder = factory.finderAtAddressRead(finderAddress);
        this.rootAddress = rootAddress;
    }

    /**
     * Deploy a list of domains and domain infos
     * @param domainNames - A list of domains
     * @param domainInfoKeyValuePair - A map of from domainName to key-value pairs
     * @throws Exception - If read/write to era fails
     */
    public void deployDomainList(List<String> domainNames,
                                 Map<String, Map<String, String>> domainInfoKeyValuePair) throws Exception {
        for (String domainName : domainNames) {
            deployDomainName(domainName);
            Map<String, String> keyValuePair = domainInfoKeyValuePair.get(domainName);
            for (String key : keyValuePair.keySet()) {
                String value = keyValuePair.get(key);
                if (!getValue(domainName, key).equals(value)) {
                    System.out.println(String.format("Key:%s Value:%s not found/needs to update...", key, value));
                    setValue(domainName, key, value);
                    System.out.println("Done");
                } else {
                    System.out.println(String.format("Key:%s Value:%s found.", key, value));
                }
            }
        }
    }

    /**
     * Set key value pair in the domain info linked with the given domain.
     * @param domainName - The domain to search for.
     * @param key - The key.
     * @param value - The value.
     */
    private void setValue(String domainName, String key, String value) throws Exception {
        DomainInfo domainInfo = factory.domainInfoAtAddressWrite(getDomainInfoAddress(domainName));
        domainInfo.setValue(key, value.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Get the value by the given key in the domain info linked with the given domain.
     * @param domainName - The domain to search for.
     * @param key - The key.
     * @return - The value.
     */
    public String getValue(String domainName, String key) {
        String value;
        try {
            DomainInfo domainInfo = factory.domainInfoAtAddressRead(getDomainInfoAddress(domainName));
            value = new String(domainInfo.getValue(key), StandardCharsets.UTF_8);
        } catch (Exception e) { return ""; }
        return value;
    }

    /**
     * Helper function to get domain info address attached to the given domain.
     * @param domainName - The domain to search for.
     * @return - The domain info address attached.
     * @throws Exception - If Read or Write failure occurs.
     */
    private String getDomainInfoAddress(String domainName) throws Exception {
        String[] domains = EraUtils.domainToDomainList(domainName, true);
        List<String> eraList = new ArrayList<>();
        eraList.add(rootAddress);

        System.out.println("Finder: Searching for Domain Info for domain: " + domainName);
        System.out.print(" Finder search parameters: " + domainName);
        for (int i = 1; i < domains.length; i++) {
            if (domains[i] != null) {
                System.out.print(", " + domains[i]);
            }
        }
        System.out.println();

        String domainInfoAddress = this.finder.resolveDomain(eraList, domainName, domains[1], domains[2], domains[3]);
        System.err.println(" Finder result: " + domainInfoAddress);
        return domainInfoAddress;
    }

    /**
     * Deploy a domainName with respect to the given rootEraAddress.
     * @param domainName - The domainName to deploy.
     * @return The last parent domain which has been registered (Will return the original domain if found).
     */
    private String deployDomainName(String domainName) throws Exception {
        String lastFoundRegisteredDomain = "NONE";
        EthereumRegistrationAuthority era = root;
        String[] domains = EraUtils.domainToDomainList(domainName);
        System.out.println("Searching for domain and parent-domains");
        for (int i = domains.length - 1; i >= 0; i--) {
            String domain = domains[i];
            System.out.println(" Domain: " + domain);
            if (era.hasDomain(domain)) {
                lastFoundRegisteredDomain = domain;
                System.out.println("  found in ERA: " + era.getContractAddress());
                String authorityAddress = era.getAuthority(domain);
                System.out.println("  ERA which contains sub-domain information: " + authorityAddress);
                String domainInfoAddress = era.getDomainInfo(domain);
                System.out.println("  Domain Info contract: " + domainInfoAddress);
                String ownerAddress = era.getDomainOwner(domain);
                System.out.println("  Owner of this ERA entry: " + ownerAddress);
                era = factory.eraAtAddressWrite(authorityAddress);

                // There is an entry in the ERA for the domain, but there is no domain info contract.
                // And the domain is the full domain.
                if (domainInfoAddress.equalsIgnoreCase("0x0000000000000000000000000000000000000000") && i == 0) {
                    registerDomain(era, domains, 0);
                }
            } else {
                System.out.println("  not found in ERA: " + era.getContractAddress());
                registerDomain(era, domains, i);
                return domain;
            }
        }
        return lastFoundRegisteredDomain;
    }

    /**
     * Register the domains in the list to the era. Deploy a domain info contract for the full domain name.
     *
     * @param era - The ERA to register the first domain in.
     * @param domains - A list of domains need to be registered.
     * @param index - Offset into the domains array from which to start registering.
     * @throws Exception - If Read or Write failure occurs.
     */
    private void registerDomain(EthereumRegistrationAuthority era, String[] domains, int index) throws Exception {
        EthereumRegistrationAuthority newEra;
        for (int i = index; i >= 0; i--) {
            if (i > 0) {
                System.out.println("Registering and deploying ERA contract for: " + domains[i]);
                // This is an intermediate domain. For the purposes of the demo, put each domain level
                // in a different ERA.
                newEra = this.factory.deployEra();
                era.addUpdateDomain(domains[i], newEra.getContractAddress(), "0x01", "0x01");
                era = newEra;
            }
            else {
                System.out.println("Registering and deploying Domain Info contract for: " + domains[i]);
                // This is the full domain. Do not create a subordinate ERA. Deploy a Domain Info contract for the domain.
                DomainInfo newDomainInfo = this.factory.deployDomainInfo();
                era.addUpdateDomain(domains[i], "0x01", newDomainInfo.getContractAddress(), "0x01");
            }
            System.out.println("Done");
        }
    }

    /**
     * Create a new Finder and print the contract address.
     * @param factory - ERA factory
     * @throws Exception - When write/read to ERA fails.
     */
    public static void createNewFinder(EthereumRegistrationAuthorityFactory factory) throws Exception {
        System.out.println("Finder created at address: " +
                factory.deployFinder().getContractAddress());
    }

    /**
     * Create a new Root ERA and print the contract address.
     * @param factory - ERA factory
     * @throws Exception - When write/read to ERA fails.
     */
    public static void createNewEra(EthereumRegistrationAuthorityFactory factory) throws Exception {
        System.out.println("Root ERA created at address: " +
                factory.deployEra().getContractAddress());
    }

    /**
     * Deploy list of eras in the config file.
     * @param br - The buffered Reader to the given config files
     * @param factory - ERA factory
     * @throws Exception - When write/read to ERA fails or invalid config file
     */
    public static void deployConfigFile(BufferedReader br,
                                        EthereumRegistrationAuthorityFactory factory) throws Exception {
        List<String> domainNames = new ArrayList<>();
        Map<String, Map<String, String>> domainInfoKeyValuePair = new HashMap<>();
        //Reading deployment config file
        String rootAddress = br.readLine();
        String finderAddress = br.readLine();
        if (rootAddress.startsWith("root=") && finderAddress.startsWith("finder=")) {
            //Get the first root era address and finder address
            rootAddress = rootAddress.substring(5);
            finderAddress = finderAddress.substring(7);
            String line;
            while ((line = br.readLine()) != null) {
                //Parse each line with format {DomainName [Key=Value]...}
                String[] splited = line.split("\\s+");
                String domainName = splited[0];
                domainNames.add(domainName);
                Map<String, String> keyValuePair = new HashMap<>();
                for (String keyValue : Arrays.copyOfRange(splited, 1, splited.length)) {
                    //Store key value pair
                    String key = keyValue.substring(0, keyValue.indexOf("="));
                    String value = keyValue.substring(keyValue.indexOf("=") + 1);
                    keyValuePair.put(key, value);
                }
                domainInfoKeyValuePair.put(domainName, keyValuePair);
            }
        } else {
            throw new Exception("Configuration File is not in the correct format.");
        }
        br.close();
        EraNetworkConfig config = new EraNetworkConfig(factory, rootAddress, finderAddress);
        config.deployDomainList(domainNames, domainInfoKeyValuePair);
        System.out.println("Deployment All Done.");
    }

    /**
     * Main class
     * @param args - Arguements.
     * @throws Exception - When write/read occurs / File format is not correct.
     */
    public static void main(String args[]) throws Exception {
        //Open config file
        BufferedReader br = new BufferedReader(new FileReader("./configuration"));
        String web3jLink = br.readLine();
        String privateKey = br.readLine();
        if (!web3jLink.startsWith("web3j=") || !privateKey.startsWith("key=")) {
            throw new Exception("Configuration File is not in the correct format.");
        }
        web3jLink = web3jLink.substring(6);
        privateKey = privateKey.substring(4);
        //Load web3j and credentials
        Web3j web3j = Web3j.build(new HttpService(web3jLink));
        Credentials credentials = Credentials.create(privateKey);
        //Load ERA factory
        EthereumRegistrationAuthorityFactory factory = new EthereumRegistrationAuthorityFactory(web3j, credentials);
        if (args.length == 1 && args[0].equals("--create-era")) {
            createNewEra(factory);
        } else if (args.length == 1 && args[0].equals("--create-finder")) {
            createNewFinder(factory);
        } else if (args.length == 1 && args[0].equals("--deploy-config")) {
            deployConfigFile(br, factory);
        } else {
            System.out.println("Options:\n" +
                    "--create-era\t\tCreate a new Era with its contract address printed.\n" +
                    "--create-finder\t\tCreate a new Finder with its contract address printed.\n" +
                    "--deploy-config\t\tDeploy list of domains specified in the config file.\n" +
                    "Note: Please provide ./configuration file in the launching directory");
        }
        web3j.shutdown();
    }
}