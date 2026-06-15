import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const newContact = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date(),
    }

    await db.collection("contacts").insertOne(newContact)
    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error: any) {
    console.error("POST contacts error:", error)
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const contacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(contacts)
  } catch (error: any) {
    console.error("GET contacts error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
