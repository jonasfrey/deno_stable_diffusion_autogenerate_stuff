import { f_o_command } from "./O_command.module.js"
import { o_prompt_string_functions } from "./o_prompt_string_functions.module.js"
var f_o_command__generate_image_with_text = async function(
    s_text,
    s_path_file_image,
    s_path_file_image_with_text,
){

    var a_s_arg = [
        "./image_blurrer",
        JSON.stringify(
            {
                "o_image_output": {
                    "s_file_extension": ".png",
                    "n_scale_x": 1920, 
                    "n_scale_y": 1080,
                    "n_float_blur_sigma": 100.0
                },
                "o_image_input":{
                    "s_path_file": s_path_file_image
                },
                "a_o_text": [
                    {
                        "s": s_text,
                        // "n_font_size_static_pixels": 100,
                        "a_n_f64__color_rgb": [0.9,0.9,0.9],
                        "a_n_f64__bgcolor_rgba": [0.05,0.05,0.05,0.4],
                        "n_padding_text_to_background": 20
                    }
                ]
            }
        )
    ]
    
    var o_command = await f_o_command(a_s_arg);

    return Promise.resolve(o_command)
    
}

export { f_o_command__generate_image_with_text }