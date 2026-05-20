import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Cloudinary automatically picks up CLOUDINARY_URL from process.env
cloudinary.config()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Stream upload directly to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "crabscart" },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })

    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (error: any) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload image to Cloudinary" },
      { status: 500 }
    )
  }
}
