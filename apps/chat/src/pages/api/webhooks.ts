import type { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.body", req.body);

  res.json({
    code: 0,
    msg: "成功",
  });
}
