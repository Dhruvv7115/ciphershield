import connectDB from "@/lib/db";
import { Service } from "@/models";

export async function GET(request) {
  try {
    await connectDB();
    const services = await Service.find({ isPublished: true });

    // Map DB services to frontend representation
    const mapped = services.map((s, index) => {
      let color = "#818CF8";
      let category = "Cybersecurity";

      const slug = s.slug || "";
      if (slug.includes("ai") || slug.includes("automation") || slug.includes("bot")) {
        color = "#6366F1";
        category = "AI & Automation";
      } else if (slug.includes("dev") || slug.includes("web") || slug.includes("app") || slug.includes("api")) {
        color = "#22D3EE";
        category = "Development";
      } else if (slug.includes("security") || slug.includes("test") || slug.includes("audit") || slug.includes("threat") || slug.includes("vapt")) {
        color = "#A855F7";
        category = "Cybersecurity";
      }

      // Map DB arrays to features
      const features = s.scope && s.scope.length > 0
        ? s.scope.slice(0, 4)
        : (s.methodology && s.methodology.length > 0 ? s.methodology.slice(0, 4) : ["Premium Service"]);

      return {
        _id: s._id.toString(),
        number: slug,
        title: s.name,
        desc: s.description,
        features: features,
        color: color,
        price: `From ₹${s.price.toLocaleString()}`,
        category: category,
        slug: slug,
      };
    });

    const categoriesSet = new Set(["All"]);
    mapped.forEach(s => categoriesSet.add(s.category));

    return Response.json({
      services: mapped,
      categories: Array.from(categoriesSet)
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
