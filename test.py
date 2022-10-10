import os

s = 'test'
o_stream = os.popen('deno run -A encode_prompt_string.module.js '+ str(s) )
output = o_stream.read()
# return output

print(len(s))
print(len(output))
print(output, end='')