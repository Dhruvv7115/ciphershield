import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Cart, Service } from "@/models";

// Helper to slugify titles
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.serviceId");
    if (!cart) {
      return Response.json({ items: [], totalPrice: 0 });
    }

    const mappedItems = cart.items.map((item) => {
      const serviceDoc = item.serviceId;
      if (!serviceDoc) return null;

      const slug = serviceDoc.slug || slugify(serviceDoc.name);

      let color = "#818CF8";
      let category = "Cybersecurity";

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

      const features = serviceDoc.scope && serviceDoc.scope.length > 0
        ? serviceDoc.scope.slice(0, 4)
        : (serviceDoc.methodology && serviceDoc.methodology.length > 0 ? serviceDoc.methodology.slice(0, 4) : ["Premium Service"]);

      return {
        number: slug,
        title: serviceDoc.name,
        desc: serviceDoc.description,
        features: features,
        color: color,
        price: `From ₹${serviceDoc.price.toLocaleString()}`,
        category: category,
        qty: item.months,
        months: item.months,
      };
    }).filter(Boolean);

    return Response.json({
      items: mappedItems,
      totalPrice: cart.totalPrice,
      discount: cart.discount,
      couponCode: cart.couponCode,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items: clientItems } = await request.json();
    if (!Array.isArray(clientItems)) {
      return Response.json({ message: "Invalid payload" }, { status: 400 });
    }

    await connectDB();

    const dbItems = [];

    for (const item of clientItems) {
      const slug = item.number || slugify(item.title);
      let dbService = await Service.findOne({ slug });

      if (!dbService) {
        const priceNumeric = parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) || 0;
        dbService = await Service.create({
          name: item.title,
          slug,
          description: item.desc || item.title,
          shortDescription: item.category || "Cybersecurity",
          price: priceNumeric,
          overview: item.desc || item.title,
          isPublished: true,
        });
      }

      const pricePerMonth = dbService.price;
      const months = item.months || item.qty || 1;
      const totalCost = months * pricePerMonth;

      dbItems.push({
        serviceId: dbService._id,
        pricePerMonth,
        months,
        totalCost,
      });
    }

    const totalPrice = dbItems.reduce((acc, item) => acc + item.totalCost, 0);

    const cart = await Cart.findOneAndUpdate(
      { user: session.user.id },
      {
        items: dbItems,
        totalPrice,
        discount: 0,
        couponCode: "",
      },
      { new: true, upsert: true }
    ).populate("items.serviceId");

    return Response.json({
      message: "Cart synced successfully",
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
