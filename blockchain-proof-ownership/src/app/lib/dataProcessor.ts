import CryptoJS from "crypto-js";

export interface Fragment {
    index: number;
    encryptedData: string;
}

/**
 * Splits data into fragments and encrypts each fragment.
 * @param data The input data to split and encrypt.
 * @param fragmentSize The size of each fragment.
 * @param encryptionKey The key used for encryption.
 * @returns Array of encrypted fragments.
 */
export function splitAndEncryptData(
    data: string,
    fragmentSize: number,
    encryptionKey: string
): Fragment[] {
    const fragments: Fragment[] = [];
    const totalFragments = Math.ceil(data.length / fragmentSize);

    for (let i = 0; i < totalFragments; i++) {
        const start = i * fragmentSize;
        const end = start + fragmentSize;
        const fragment = data.slice(start, end);

        // Encrypt the fragment
        const encryptedFragment = CryptoJS.AES.encrypt(
            fragment,
            encryptionKey
        ).toString();

            fragments.push({ index: i, encryptedData: encryptedFragment });
    }

    return fragments;
}

/**
 * Decrypts a list of encrypted fragments and combines them into the original data.
 * @param fragments Array of encrypted fragments.
 * @param encryptionKey The key used for decryption.
 * @returns The reconstructed original data.
 */
export function decryptAndCombineData(
    fragments: Fragment[],
    encryptionKey: string
): string {
    return fragments
    .map(({ encryptedData }) =>
        CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(
            CryptoJS.enc.Utf8
        )
    )
    .join("");
}
