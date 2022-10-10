import { f_o_command } from "./O_command.module.js"
import { o_prompt_string_functions } from "./o_prompt_string_functions.module.js"
var f_o_command__generate_image = async function(
    s_text,
    n_seed,
    s_path_file,
){

    var a_s_arg = [
        "python",
        "./optimizedSD/optimized_txt2img.py",
        "--prompt",
        `${s_text}`,
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
        "50",
        "--s_path_file",
        s_path_file,
    ]

    var o_command = await f_o_command(a_s_arg);
    return Promise.resolve(o_command)
    
}

export { f_o_command__generate_image }