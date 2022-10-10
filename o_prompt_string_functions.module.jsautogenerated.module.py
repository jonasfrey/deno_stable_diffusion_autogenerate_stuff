

# this file was automatically created!

import os
import json

def f_s_encoded(s):
    o_params = {
        's_function_name': 'f_s_encoded',
        'a_argument': [s]
    }
    o_stream = os.popen('deno run -A file:///home/manjarouser/code/stable-diffusion/o_prompt_string_functions.module.js json.dumps(o_params)')
    output = o_stream.read()
    return output
