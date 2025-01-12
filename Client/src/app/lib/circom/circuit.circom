pragma circom 2.0.0;

template VerifyUserId() {
    signal input userId;      // The userId to verify
    signal output valid;      // The output signal, 1 if valid, 0 otherwise

    // Temporary signal to hold the difference from zero
    signal diff;

    // The valid signal will be 1 if userId > 0
    diff <== userId;    // diff will hold userId value

    // valid should be 1 if userId > 0, otherwise 0
    valid <== (diff > 0);  // This will be 1 if diff > 0, otherwise 0
}

component main = VerifyUserId();
