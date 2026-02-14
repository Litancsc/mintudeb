
import Service from "@/models/Service";
import Location from "@/models/Location";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  await dbConnect();

  // Insert single service (if not exists)
  const existingService = await Service.findOne({ slug: "car-rental" });
  if (!existingService) {
    await Service.create({
      name: "Car Rental",
      slug: "car-rental",
      keywords: ["car rental", "low cost car rental", "cheap car rent"],
      seoTitle: "Low Cost Car Rental in {{location}} | Cheap Car Hire",
      seoDescription: "Book low cost car rental in {{location}} at best price.",
      active: true
    });
  }

  // Insert locations (skip if already exists)
  const locations = ["shillong", "guwahati"];
  for (const loc of locations) {
    const exists = await Location.findOne({ slug: loc });
    if (!exists) {
      if (loc === "shillong") {
        await Location.create({
          name: "Shillong",
          slug: "shillong",
          state: "Meghalaya",
          areas: ["Police Bazar", "Shillong Airport"],
          active: true
        });
      }
      if (loc === "guwahati") {
        await Location.create({
          name: "Guwahati",
          slug: "guwahati",
          state: "Assam",
          areas: ["Paltan Bazar", "Guwahati Airport"],
          active: true
        });
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
