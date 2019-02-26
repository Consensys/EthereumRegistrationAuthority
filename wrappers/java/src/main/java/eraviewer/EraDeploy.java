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
package eraviewer;

import era.EthereumRegistrationAuthority;
import era.EthereumRegistrationAuthorityFactory;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.io.BufferedReader;
import java.io.FileReader;

public class EraDeploy {
    /* The ERA wrapper interface instance. */
    private EthereumRegistrationAuthorityFactory factory;

    /**
     * Constructor.
     * @param tokenFile - File stores the infura token for rinkeby remote node.
     * @throws Exception - If Read or Write failure occurs.
     */
    public EraDeploy(String tokenFile, String privateKeyFile) throws Exception {
        BufferedReader br = new BufferedReader(new FileReader(tokenFile));
        String token = br.readLine();
        br.close();

        // Read in ECC private key which is related to an account with Ether in it on Rinkeby.
        br = new BufferedReader(new FileReader(privateKeyFile));
        String privateKey = br.readLine();
        br.close();

        Web3j web3j = Web3j.build(new HttpService("https://rinkeby.infura.io/v3/" + token));
        Credentials credentials = Credentials.create(privateKey);
        this.factory = new EthereumRegistrationAuthorityFactory(web3j, credentials);
    }



    public void deployEra() throws Exception {
        EthereumRegistrationAuthority newEra = factory.deployEra();

        String address = newEra.getContractAddress();

        System.out.println("New ERA's address is: " + address);

    }






    public static void main(String args[]) throws Exception {
        System.err.println("ERA Deploy started with parameters:");

        if (args.length != 2) {
            System.err.println("Usage: eradeploy tokenFileName keyFile");
            return;
        }
        System.err.println(" Infura ProjectID / token file name: " + args[0]);
        System.err.println(" Key file: " + args[1]);


        EraDeploy eraController = new EraDeploy(args[0], args[1]);

        eraController.deployEra();
    }

}
