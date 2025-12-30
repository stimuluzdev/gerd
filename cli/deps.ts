export { parse } from "https://deno.land/std@0.200.0/flags/mod.ts";
export type { Args } from "https://deno.land/std@0.200.0/flags/mod.ts";
export { assertEquals } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import figlet from "https://deno.land/x/deno_figlet@1.0.0/mod.ts";
import * as Path from "https://deno.land/std@0.207.0/path/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import * as Prompt from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";

const fig = figlet;
export { fig, Path, Prompt, readline };

