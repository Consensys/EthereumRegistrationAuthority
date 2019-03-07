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
package tech.pegasys.era;

import org.bouncycastle.util.encoders.Hex;
import org.web3j.crypto.Hash;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

public class EraUtils {

    public static final String EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

    /**
     * Create a list of parent domains.
     *
     * Examples
     * -------
     *
     * Input                  Output
     * internet               [0] internet
     * example.com            [0] example.com          [1] com
     * aa.example.com         [0] aa.example.com       [1] example.com         [2] com
     * sc1.aa.example.com     [0] sc1.aa.example.com   [1] aa.example.com      [2] example.com     [3] com
     * b.sc1.aa.example.com   [0] b.sc1.aa.example.com [1] sc1.aa.example.com  [2] aa.example.com  [3] example.com
     *
     *
     * @param domainName the domain name.
     * @return Array of the domain and parent domains.
     * @throws Exception If the domain name is invalid.
     */
    public static String[] domainToDomainList(String domainName) throws Exception {
        return domainToDomainList(domainName, false);
    }


    public static String[] domainToDomainList(String domainName, boolean fixedLengthArray) throws Exception {
        final int MAX_DEPTH = 4;
        String[] domains = new String[MAX_DEPTH];
        domains[0] = domainName;

        //currentDomain.

        String currentDomain = domainName;
        for (int parentDomainDepth = 1; parentDomainDepth < MAX_DEPTH; parentDomainDepth++) {
            int dotIndex = currentDomain.indexOf(".");
            if (dotIndex == 0) {
                // This first character is a dot, which is illegal.
                throw new Exception("Illegal domain name");
            }
            if (dotIndex == -1) {
                // There are no more parent domains.
                if (fixedLengthArray) {
                    return domains;
                }
                String[] domains1 = new String[parentDomainDepth];
                for (int i = 0; i < parentDomainDepth; i++) {
                    domains1[i] = domains[i];
                }
                return domains1;
            }
            currentDomain = currentDomain.substring(dotIndex + 1);
            domains[parentDomainDepth] = currentDomain;
        }
        return domains;
    }

    /**
     * Get the BigInteger representation of given domain name.
     * @param domainName - String of domain name.
     * @return Keccak256 Hash of the given domain name in BigInteger representation.
     */
    static BigInteger convertDomainToDomainHash(String domainName) {
        if (domainName == null) {
            return BigInteger.ZERO;
        }
        String hexString = Hash.sha3(Hex.toHexString(domainName.getBytes(StandardCharsets.UTF_8))).substring(2);
        return new BigInteger(hexString, 16);
    }
}
