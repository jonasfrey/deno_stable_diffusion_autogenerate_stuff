import { o_prompt_string_functions } from "./o_prompt_string_functions.module.js";

var s = o_prompt_string_functions.f_s_decoded(Deno.args[0])
s = new TextEncoder().encode(s)
await Deno.writeAll(Deno.stdout, s)