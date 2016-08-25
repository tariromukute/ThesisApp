
//https://tools.ietf.org/html/rfc5764#page-5

#ifndef DTLS_SRTP_H
#define DTLS_SRTP_H

/**
 * ******************** Example of Profiles ************************
 * SRTPProtectionProfile SRTP_AES128_CM_HMAC_SHA1_80 = {0x00, 0x01};
 * SRTPProtectionProfile SRTP_AES128_CM_HMAC_SHA1_32 = {0x00, 0x02};
 * SRTPProtectionProfile SRTP_NULL_HMAC_SHA1_80      = {0x00, 0x05};
 * SRTPProtectionProfile SRTP_NULL_HMAC_SHA1_32      = {0x00, 0x06};
 * *****************************************************************
 */
uint8 srtp_protection_profile[2];

/**
 * use_srtp_data must be put into the extension_data field of the "use_srtp"
 */
struct {
  srtp_protection_profiles srtp_rotection_profiles;
  /**
   * rtp_mki value contains the SRTP Master Key
   * Identifier (MKI) value (if any) that the client will use for his SRTP
   * packets.  If this field is of zero length, then no MKI will be used
   */
  opaque srtp_mki; //<0..255> variable length, maybe 0 to 255 bytes
} use_srtp_data;

/**
 * indicates the SRTP protection profiles that the client is willing to support
 * in descending order
 */
srtp_protection_profile srtp_rotection_profiles<2..2^16-1>;


/** step 1 **
 * ClientHello + use_srtp 
 * "use_srtp" must contain use_srtp_data
 */
void dtls_srtp_send_hello();

/* step 2 */ 
void dtls_srtp_receive_hello();


/** step 3 **
 * ServerHello + use_srtp
 * Certificate*
 * CertificateRequest*
 * ServerHelloDone
 * *************************** Notes ************************************
 * If the server is willing to accept the use_srtp extension, it MUST
 * respond with its own "use_srtp" extension in the ExtendedServerHello.
 * The extension_data field MUST contain a UseSRTPData value with a
 * single SRTPProtectionProfile value that the server has chosen for use
 * with this connection
 * 
 * include a matching "srtp_mki" value in its "use_srtp" extension
 * to indicate that it will make use of the MKI, or
 * return an empty "srtp_mki" value to indicate that it cannot make
 * use of the MKI.
 *
 * If the client detects a nonzero-length MKI in the server's response
 * that is different than the one the client offered, then the client
 * MUST abort the handshake and SHOULD send an invalid_parameter alert.
 * If the client and server agree on an MKI, all SRTP packets protected
 * under the new security parameters MUST contain that MKI.
 * **********************************************************************
 */
void dtls_srtp_send_cert();

/** step 4 **
 *
 * ***************************** Notes **********************************
 *
 * **********************************************************************
 */
void dtls_srtp_receive_cert();

/* step 5 */
/**
 * Certificate*
 * ClientKeyExchange
 * CertificateVerify*
 * [ChangeCipherSpec]
 * Finished
 */ 
void dtls_srtp_send_find();

/* step 6 */ 
void dtls_srtp_receive_find();

#endif
