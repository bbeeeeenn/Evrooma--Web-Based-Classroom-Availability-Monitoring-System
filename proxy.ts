import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
    const url = new URL(request.url);
    return NextResponse.next({
        headers: {
            "x-pathname": url.pathname,
        },
    });
}
