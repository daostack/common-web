// The order is important here!
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}


import "./mockMatchMedia";
import "@/projectSetupImports";
import "./mockConfig";
import "./mockReactScrollbarsCustom";
import "./mockReactMergeRefs";
import "./mockStorages";
