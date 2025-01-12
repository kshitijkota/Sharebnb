pragma circom 2.0.0;

template IsPositive() {
    signal input in;
    signal output out;

    // We'll use a binary decomposition approach
    // Assuming input is 32 bits maximum
    signal bits[32];
    var lc = 0;

    // Convert to binary
    for (var i = 0; i < 32; i++) {
        bits[i] <-- (in >> i) & 1;
        // Constraint bits to be 0 or 1
        bits[i] * (bits[i] - 1) === 0;
        lc = lc + bits[i] * (1 << i);
    }

    // Ensure the binary decomposition matches the input
    lc === in;

    // If any bit is 1, the number is positive
    var sum = 0;
    for (var i = 0; i < 32; i++) {
        sum = sum + bits[i];
    }

    // Output 1 if sum > 0 (meaning at least one bit is 1)
    out <-- (sum > 0) ? 1 : 0;
    out * (out - 1) === 0; // Constraint output to be 0 or 1
}

template VerifyUserId() {
    signal input userId;
    signal output valid;

    component isPos = IsPositive();
    isPos.in <== userId;
    valid <== isPos.out;
}

component main = VerifyUserId();