import { NextRequest, NextResponse } from "next/server";
import { splitAndEncryptData } from "../../lib/dataProcessor";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, fragmentSize, encryptionKey } = body;

        if (!data || !fragmentSize || !encryptionKey) {
        return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
        );
        }

        const fragments = splitAndEncryptData(data, fragmentSize, encryptionKey);
        return NextResponse.json({ fragments }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
        { error: "Error processing data" },
        { status: 500 }
        );
    }
}
