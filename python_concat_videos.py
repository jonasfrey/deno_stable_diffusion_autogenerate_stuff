# coding=utf8
from moviepy.editor import VideoFileClip, concatenate_videoclips

import sys

import json

# print(sys.argv[1])
# print("asdf")
s_path = "./json.json"
f = open(s_path,'r')
# Opening JSON file  
# returns JSON object as 
# a dictionary
o_data = json.load(f)
# s = f.readlines()
# print(s)
# o = json.loads(str(s))
# print(o)
print(o_data)
# # print("kkkk")

# print(sys.argv[1])
# with open(sys.argv[1]) as f:
    # lines = f.readlines()
    # print(lines)
# s_json = open(sys.argv[1], "r")
# o = json.loads(s_json)
# print(o)
# s_path_output = sys.argv[1]
a_o_clip = [VideoFileClip(s) for s in o_data["a_s_path_video"]]
# print(a_o_clip)
final_clip = concatenate_videoclips(a_o_clip[0:100])
final_clip.write_videofile(o_data["s_path_video"])
sys.exit(0)