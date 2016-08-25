
//https://tools.ietf.org/html/rfc5764#page-5

#ifndef DTLS_SRTP_H
#define DTLS_SRTP_H

uint8 SRTPProtectionProfile[2];

struct {
  SRTPProtectionProfiles SRTPProtectionProfiles;
  /**
   * rtp_mki value contains the SRTP Master Key
   * Identifier (MKI) value (if any) that the client will use for his SRTP
   * packets.  If this field is of zero length, then no MKI will be used
   */
  opaque srtp_mki; //<0..255> variable length, maybe 0 to 255 bytes
} UseSRTPData;

/**
 * indicates the SRTP protection profiles that the client is willing to support
 * in descending order
 */
SRTPProtectionProfile SRTPProtectionProfiles<2..2^16-1>;

void dtls_srtp_send_hello();

void dtls_srtp_send_cert();

void dtls_srtp_send_find();

void dtls_srtp_receive_hello();

void dtls_srtp_receive_cert();

void dtls_srtp_receive_find();

#endif
