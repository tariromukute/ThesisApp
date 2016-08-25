
/**
 * '*' indicates that a message is not always sent in DTLS
 */

//ClientHello + use_srtp
void dtls_srtp_send_hello(){
  
}

void dtls_srtp_receive_hello(){

}

/**
 * ServerHello + use_srtp
 * Certificate*
 * CertificateRequest*
 * ServerHelloDone
 */
void dtls_srtp_send_cert(){

}

void dtls_srtp_receive_cert(){

}


/**
 * Certificate*
 * ClientKeyExchange
 * CertificateVerify*
 * [ChangeCipherSpec]
 * Finished
 */
void dtls_srtp_send_find(){

}







void dtls_srtp_receive_find(){

}
