import { CreateNodeArgs } from "gatsby";
import fetch from "cross-fetch";
import path from "path";
import { createFileNodeFromBuffer } from "gatsby-source-filesystem";
import { buffer } from "get-stream";

interface PluginOptions {
  carbonaraOptions?: any;
  carbonaraUrl?: string;
  sourceInstanceName: string;
}

const DEFAULT_CARBONARA_OPTIONS = {};
const DEFAULT_CARBONARA_URL = "https://carbonara.vercel.app/api/cook";

export async function onCreateNode(
  {
    node,
    loadNodeContent,
    store,
    cache,
    createNodeId,
    actions,
  }: CreateNodeArgs,
  {
    carbonaraOptions = DEFAULT_CARBONARA_OPTIONS,
    carbonaraUrl = DEFAULT_CARBONARA_URL,
    sourceInstanceName,
  }: PluginOptions = {
    sourceInstanceName: "",
  }
) {
  if (
    node.sourceInstanceName !== sourceInstanceName ||
    !node.internal.mediaType
  ) {
    return;
  }

  const nodeAbsolutePath = node.absolutePath as string;
  const content = await loadNodeContent(node);

  const res = await fetch(carbonaraUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...carbonaraOptions,
      code: content,
    }),
  });

  const imageBuffer = await buffer(res.body as any);

  const fileNode = await createFileNodeFromBuffer({
    buffer: imageBuffer,
    store,
    cache,
    createNodeId,
    ...actions,
    name: path.basename(nodeAbsolutePath, path.extname(nodeAbsolutePath)),
    ext: ".png",
    parentNodeId: node.id,
  });

  fileNode.sourceInstanceName = sourceInstanceName;
}
