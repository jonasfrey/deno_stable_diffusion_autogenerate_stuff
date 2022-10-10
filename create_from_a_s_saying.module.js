import { O_command, f_o_command, O_command_log } from "./O_command.module.js";
import { a_s_saying } from "./a_s_saying.module.js";
// var a_o_command_log = []

var a_o_command_log = []
var f_n_seed = function(
    s_prompt
){
    // "Hello" => as bytes  [ 72, 101, 108, 108, 111 ] => as sum 500 , use that sum as the seed
    var a_n_byte = new TextEncoder().encode(s_prompt);
    // console.log(a_n_byte)
    var n_sum = a_n_byte.reduce((n_sum, n)=>n_sum+n)
    // console.log(n_sum)
    return n_sum;
}

var s_file_prefix = import.meta.url.split("/").pop().split(".").shift()
var s_path_folder = `./${s_file_prefix}`;

for(var s_unusual_word of a_s_saying){
    var n_seed = f_n_seed(s_unusual_word);
    var a_s_arg = [
        "python",
        "./optimizedSD/optimized_txt2img.py",
        "--prompt",
        `${s_unusual_word}`,
        "--outdir", 
        s_path_folder,
        "--H",
        "512",
        "--W",
        "512",
        "--seed",
        n_seed,
        "--n_iter",
        "1",
        "--n_samples",
        "1",
        "--ddim_steps",
        "50"
    ]
    
    var o_command = await f_o_command(a_s_arg);
    
    a_o_command_log.push(
        new O_command_log(
            o_command.n_ts_ms_start,
            o_command.n_ts_ms_end,
            o_command.n_ts_ms_delta,
            o_command.s_command,
            o_command.s_stderr,
            o_command.s_stdout
        )
    );
    console.log(o_command)

}


var s_file_name = `a_o_command_log_${new Date().getTime()}.module.js`;
Deno.writeTextFile(
    `${s_path_folder}/${s_file_name}`, 
    JSON.stringify(
        a_o_command_log
    )
); 

