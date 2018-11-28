package tech.pegasys.era;

import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.utils.Numeric;
import tech.pegasys.era.internal.AutoGeneratedDomainInfo;
import java.math.BigInteger;

/**
 * DomainInfo Java Wrapper Class.
 */
public class DomainInfo {

    private RemoteCall<AutoGeneratedDomainInfo> domainInfoAutoGenWrapper;
    private AutoGeneratedDomainInfo domainInfoAutoGenWrapperReal;

    public DomainInfo(RemoteCall<AutoGeneratedDomainInfo> domainInfoAutoGenWrapper) {
        this.domainInfoAutoGenWrapper = domainInfoAutoGenWrapper;
    }

    public boolean isReady() {
        return domainInfoAutoGenWrapperReal != null;
    }

    public void waitUntilReady() {
        // Convert from RemoteCall to Concrete Class
        while (true) {
            try {
                domainInfoAutoGenWrapperReal = domainInfoAutoGenWrapper.send();
                break;
            } catch (Exception e) {
            }
        }
    }

    //Key is the String of the domain name.
    public RemoteCall<TransactionReceipt> setValue(String key, byte[] value) {
        BigInteger keyHash = getDomainHash(key);
        return domainInfoAutoGenWrapperReal.setValue(keyHash, value);
    }

    public RemoteCall<TransactionReceipt> deleteValue(String key) {
        BigInteger keyHash = getDomainHash(key);
        return domainInfoAutoGenWrapperReal.deleteValue(keyHash);
    }

    public RemoteCall<byte[]> getValue(String key) {
        BigInteger keyHash = getDomainHash(key);
        return domainInfoAutoGenWrapperReal.getValue(keyHash);
    }

    public RemoteCall<BigInteger> getVersion() {
        return domainInfoAutoGenWrapperReal.getVersion();
    }

    /**
     * Get the BigInteger representation of given domain name.
     * @param domainName - String of domain name.
     * @return Keccak256 Hash of the given domain name in BigInteger representation.
     */
    private BigInteger getDomainHash(String domainName) {
        return Numeric.decodeQuantity(domainName);
    }
}