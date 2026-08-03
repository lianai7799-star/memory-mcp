export const TOOLS = [
  {
    name: "memory",
    description: "Memory operations. Use action parameter: briefing, read_memo, write_memo, read_core, read, search, save, archive, check_time",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["briefing", "read_memo", "write_memo", "read_core", "read", "search", "save", "archive", "check_time"],
          description: "Operation type"
        },
        id: { type: "string" },
        pool: { type: "string", enum: ["core", "knowledge", "moment", "memo"] },
        title: { type: "string" },
        summary: { type: "string" },
        content: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        date: { type: "string" },
        moment_type: { type: "string", enum: ["daily", "scene", "milestone"] },
        source: { type: "string" },
        dimension: { type: "string" },
        q: { type: "string" },
        limit: { type: "number" },
        confirmed: { type: "boolean" }
      },
      required: ["action"]
    }
  }
];

export const SERVER_INFO = { name: "memory-server", version: "1.0.0" };
export const SERVER_CAPABILITIES = { tools: {} };
