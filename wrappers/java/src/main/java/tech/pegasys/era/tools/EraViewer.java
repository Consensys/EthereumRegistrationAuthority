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

import tech.pegasys.era.EraUtils;
import tech.pegasys.era.EthereumRegistrationAuthority;
import tech.pegasys.era.EthereumRegistrationAuthorityFactory;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.io.BufferedReader;
import java.io.FileReader;

public class EraViewer {
    /* The default address for the top level era deployed in rinkeby testnet. */
//    private static final String DEFAULT_TOP_ERA_ADDRESS = "0x81d5fc4038318142f85131bff07c2405f38f16e2";

    // In typical deployments, there could be more than one root ERA. The make things simpler, we will
    // just use one.
    private String rootEraAddress;


    /* The ERA wrapper interface instance. */
    private EthereumRegistrationAuthorityFactory factory;

    /**
     * Constructor.
     * @param tokenFile - File stores the infura token for rinkeby remote node.
     * @throws Exception - If Read or Write failure occurs.
     */
    public EraViewer(String tokenFile, String rootEraAddressFile) throws Exception {
        BufferedReader br = new BufferedReader(new FileReader(tokenFile));
        String token = br.readLine();
        br.close();

        br = new BufferedReader(new FileReader(rootEraAddressFile));
        this.rootEraAddress = br.readLine();
        br.close();

        Web3j web3j = Web3j.build(new HttpService("https://rinkeby.infura.io/v3/" + token));
        factory = new EthereumRegistrationAuthorityFactory(web3j);
    }



    public void showDomainInfo(String domainName) throws Exception {
        EthereumRegistrationAuthority rootEra = this.factory.eraAtAddressRead(this.rootEraAddress);
        showDomainInfo(rootEra, domainName);

    }


    public void showDomainInfo(EthereumRegistrationAuthority era, String domainName) throws Exception {
        String[] domains = EraUtils.domainToDomainList(domainName);

        System.out.println("Using ERA at address: " + era.getContractAddress());


        for (int i = 0; i < domains.length; i++) {
            System.out.println("Domain: " + domains[i]);

            Boolean hasDomain = era.hasDomain(domains[i]);
            System.out.println(" Has domain in Root ERA: " + hasDomain);


            String domainInfoAddress = era.getDomainInfo(domains[i]);
            System.out.println(" Domain Info contract Address: " + domainInfoAddress);

            String authorityInfoAddress = era.getAuthority(domains[i]);
            System.out.println(" Delegate ERA Address: " + authorityInfoAddress);

            String domainOwner = era.getDomainOwner(domains[i]);
            System.out.println(" Account which can update domain entry: " + domainOwner);
        }

    }






    public static void main(String args[]) throws Exception {
        System.err.println("ERA Viewer started with parameters:");

        if (args.length != 3) {
            System.err.println("Usage: eraviewer tokenFileName ERAaddressFilename domain");
            return;
        }
        System.err.println(" Infura ProjectID / token file name: " + args[0]);
        System.err.println(" Root ERA Address: " + args[1]);
        System.err.println(" Domain: " + args[2]);


        EraViewer eraController = new EraViewer(args[0], args[1]);

        eraController.showDomainInfo(args[2]);
    }

}
