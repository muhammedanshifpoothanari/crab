import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    let settings = await db.collection("settings").findOne({ type: "payment_methods" })

    // Auto-create default settings if none exist
    if (!settings) {
      const defaultSettings = {
        type: "payment_methods",
        cardEnabled: true,
        upiEnabled: true,
        codEnabled: true,
        whatsappCheckoutEnabled: false,
        adminWhatsAppNumber: "919876543210",
        updatedAt: new Date(),
      }
      await db.collection("settings").insertOne(defaultSettings)
      settings = defaultSettings
    }

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error("GET settings error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { cardEnabled, upiEnabled, codEnabled, whatsappCheckoutEnabled, adminWhatsAppNumber } = body

    const result = await db.collection("settings").updateOne(
      { type: "payment_methods" },
      {
        $set: {
          cardEnabled: cardEnabled ?? true,
          upiEnabled: upiEnabled ?? true,
          codEnabled: codEnabled ?? true,
          whatsappCheckoutEnabled: whatsappCheckoutEnabled ?? false,
          adminWhatsAppNumber: adminWhatsAppNumber ?? "919876543210",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      success: true, 
      cardEnabled, 
      upiEnabled, 
      codEnabled, 
      whatsappCheckoutEnabled, 
      adminWhatsAppNumber 
    })
  } catch (error: any) {
    console.error("POST settings error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
