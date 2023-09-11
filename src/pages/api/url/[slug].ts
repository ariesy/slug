import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;
  const hostname = env.SITE_URL;
  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      error: "[X] Error: Missing slug? Remember that urls start like this: /u/yourLink",
    });
  }

  const data = await prisma.link.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    return res.status(404).json({
      error: `[X] Error: Link not found or removed. Go to ${hostname} and create a new link.`,
    });
  }

  // Cache:
  res.setHeader("Cache-Control", "s-maxage=1000000, stale-while-revalidate");

  return res.json(data);
};
