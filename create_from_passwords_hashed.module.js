import { O_command, f_o_command, O_command_log } from "./O_command.module.js";
import { a_s_saying } from "./a_s_saying.module.js";
import { f_s_hashed_md5 } from "f_s_hashed_md5.module.js";
// var a_o_command_log = []

//  A formatted version of a popular md5 implementation.
//  Original copyright (c) Paul Johnston & Greg Holt.
//  The function itself is now 42 lines long.



var a_s_common_password = [
"123456",
"password",
"12345678",
"qwerty",
"123456789",
"12345",
"1234",
"111111",
"1234567",
"dragon",
"123123",
"baseball",
"abc123",
"football",
"monkey",
"letmein",
"696969",
"shadow",
"master",
"666666",
"qwertyuiop",
"123321",
"mustang",
"1234567890",
"michael",
"654321",
"pussy",
"superman",
"1qaz2wsx",
"7777777",
"fuckyou",
"121212",
"000000",
"qazwsx",
"123qwe",
"killer",
"trustno1",
"jordan",
"jennifer",
"zxcvbnm",
"asdfgh",
"hunter",
"buster",
"soccer",
"harley",
"batman",
"andrew",
"tigger",
"sunshine",
"iloveyou",
"fuckme",
"2000",
"charlie",
"robert",
"thomas",
"hockey",
"ranger",
"daniel",
"starwars",
"klaster",
"112233",
"george",
"asshole",
"computer",
"michelle",
"jessica",
"pepper",
"1111",
"zxcvbn",
"555555",
"11111111",
"131313",
"freedom",
"777777",
"pass",
"fuck",
"maggie",
"159753",
"aaaaaa",
"ginger",
"princess",
"joshua",
"cheese",
"amanda",
"summer",
"love",
"ashley",
"6969",
"nicole",
"chelsea",
"biteme",
"matthew",
"access",
"yankees",
"987654321",
"dallas",
"austin",
"thunder",
"taylor",
"matrix"
]


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

for(var a_s_common_password of a_s_common_password){
    var n_seed = f_n_seed(a_s_common_password);
    var a_s_arg = [
        "python",
        "./optimizedSD/optimized_txt2img.py",
        "--prompt",
        `${f_s_hashed_md5(a_s_common_password)}`,
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


