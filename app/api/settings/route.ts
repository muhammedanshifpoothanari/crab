import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getCache, setCache, invalidateCache } from "@/lib/cache"

const CACHE_KEY = "settings_payment_methods"
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600",
}

export async function GET() {
  try {
    // 1. Check in-memory cache first
    const cachedSettings = getCache(CACHE_KEY)
    if (cachedSettings) {
      return NextResponse.json(cachedSettings, { headers: CACHE_HEADERS })
    }

    // 2. Cache miss: Query MongoDB Atlas
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
        adminWhatsAppNumber: "919778300633",
        updatedAt: new Date(),
      }
      await db.collection("settings").insertOne(defaultSettings)
      settings = defaultSettings
    }

    // 3. Set cache for 5 minutes
    setCache(CACHE_KEY, settings, 300)

    return NextResponse.json(settings, { headers: CACHE_HEADERS })
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
          adminWhatsAppNumber: adminWhatsAppNumber ?? "919778300633",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    // Invalidate settings cache
    invalidateCache(CACHE_KEY)

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
